import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";
import type { Connect, Plugin } from "vite";
import { defineConfig, loadEnv } from "vite";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Load environment variables from .env and .env.local files
// Vite's loadEnv only loads VITE_ prefixed variables, but we need all variables for server-side API routes
const loadAllEnv = () => {
	const envFiles = [".env", ".env.local"];
	for (const file of envFiles) {
		const envPath = path.resolve(__dirname, file);
		if (fs.existsSync(envPath)) {
			const content = fs.readFileSync(envPath, "utf-8");
			content.split("\n").forEach((line) => {
				const trimmed = line.trim();
				if (trimmed && !trimmed.startsWith("#")) {
					const [key, ...rest] = trimmed.split("=");
					if (key) {
						process.env[key.trim()] = rest.join("=").trim();
					}
				}
			});
		}
	}
};
loadAllEnv();

/**
 * Vite plugin to handle API routes during development.
 * Intercepts /api/* requests and executes the appropriate handler from api/ directory.
 * This allows Vercel serverless functions to work during Vite dev without a separate server.
 */
function apiRoutesPlugin(): Plugin {
	return {
		name: "api-routes",
		configureServer(server) {
			// Register API middleware BEFORE other middlewares
			server.middlewares.use("/api", (async (req, res, next) => {
				console.log(`[API Routes] ${req.method} ${req.url}`);

				try {
					// Extract the API route from the URL
					// The middleware is registered at "/api", so req.url is already stripped (e.g., "/v2-waitlist")
					const urlPath = req.url?.split("?")[0] || "";
					const routePath = urlPath.replace(/^\//, "").replace(/\/$/, "");
					console.log(`[API Routes] Route path: "${routePath}"`);
					console.log(`[API Routes] __dirname: ${__dirname}`);

					// Construct the handler path using __dirname
					const handlerPath = path.resolve(__dirname, "api", `${routePath}.ts`);

					console.log(`[API Routes] Handler path: ${handlerPath}`);

					// Check if the handler file exists
					const fs = await import("node:fs");
					if (!fs.existsSync(handlerPath)) {
						console.log(`[API Routes] Handler not found: ${handlerPath}`);
						return next();
					}

					console.log(`[API Routes] Loading handler...`);

					// Use tsx to load TypeScript files
					const { tsImport } = await import("tsx/esm/api");
					const handlerModule = await tsImport(handlerPath, import.meta.url);
					const handler = handlerModule.default;

					if (typeof handler !== "function") {
						console.error(`[API Routes] Handler is not a function`);
						res.statusCode = 500;
						res.setHeader("Content-Type", "application/json");
						res.end(JSON.stringify({ error: "Handler is not a function" }));
						return;
					}

					console.log(`[API Routes] Parsing body for ${req.method}...`);

					// Parse request body for POST/PUT/PATCH requests
					let body = {};
					if (
						req.method === "POST" ||
						req.method === "PUT" ||
						req.method === "PATCH"
					) {
						const chunks: Buffer[] = [];
						for await (const chunk of req) {
							chunks.push(chunk);
						}
						const rawBody = Buffer.concat(chunks).toString();
						console.log(`[API Routes] Raw body length: ${rawBody.length}`);
						if (rawBody) {
							try {
								body = JSON.parse(rawBody);
								console.log(`[API Routes] Parsed JSON body successfully`);
							} catch (_e) {
								console.log(
									`[API Routes] Failed to parse JSON, using raw body`,
								);
								body = rawBody;
							}
						}
					}

					// Parse query string manually
					const query: Record<string, string> = {};
					const queryString = req.url?.split("?")[1];
					if (queryString) {
						for (const pair of queryString.split("&")) {
							const [key, value] = pair.split("=");
							if (key)
								query[decodeURIComponent(key)] = decodeURIComponent(
									value || "",
								);
						}
					}

					// Create mock VercelRequest and VercelResponse objects
					const vercelReq = {
						method: req.method,
						url: req.url,
						query,
						body,
						headers: req.headers,
						cookies: {},
					};

					const vercelRes = {
						statusCode: 200,
						status(code: number) {
							this.statusCode = code;
							return this;
						},
						json(data: unknown) {
							res.statusCode = this.statusCode;
							res.setHeader("Content-Type", "application/json");
							res.end(JSON.stringify(data));
							return this;
						},
						end(data?: string | Buffer) {
							if (data) {
								res.end(data);
							} else {
								res.end();
							}
							return this;
						},
						setHeader(name: string, value: string) {
							res.setHeader(name, value);
							return this;
						},
					};

					console.log(`[API Routes] Calling handler...`);

					// Call the handler
					await handler(vercelReq, vercelRes);

					console.log(`[API Routes] Handler completed successfully`);
				} catch (error) {
					console.error("[API Routes] Error:", error);
					if (!res.headersSent) {
						res.statusCode = 500;
						res.setHeader("Content-Type", "application/json");
						res.end(
							JSON.stringify({
								error: "Internal server error",
								details: String(error),
							}),
						);
					}
				}
			}) as Connect.NextHandleFunction);
		},
	};
}

export default defineConfig({
	plugins: [basicSsl(), react(), apiRoutesPlugin()],
	server: {
		port: 3000,
		host: "0.0.0.0",
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "."),
		},
	},
});
