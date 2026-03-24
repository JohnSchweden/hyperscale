import { promises as fs } from "node:fs";
import path from "node:path";

export async function getDirectorySize(dirPath: string): Promise<number> {
	let size = 0;
	const entries = await fs.readdir(dirPath, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = path.join(dirPath, entry.name);
		if (entry.isDirectory()) {
			size += await getDirectorySize(fullPath);
		} else {
			const stats = await fs.stat(fullPath);
			size += stats.size;
		}
	}
	return size;
}

export async function countFiles(
	dirPath: string,
	extension: string,
): Promise<number> {
	let count = 0;
	const entries = await fs.readdir(dirPath, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = path.join(dirPath, entry.name);
		if (entry.isDirectory()) {
			count += await countFiles(fullPath, extension);
		} else if (entry.name.endsWith(extension)) {
			count++;
		}
	}
	return count;
}

export function formatBytes(bytes: number): string {
	const mb = bytes / (1024 * 1024);
	return `${mb.toFixed(2)} MB`;
}
