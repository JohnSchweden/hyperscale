# Contributing Guide

Thank you for your interest in contributing to K-Maru: The Hyperscale Chronicles! This document outlines the workflow, standards, and best practices for contributing.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Adding Content](#adding-content)
- [Testing Requirements](#testing-requirements)
- [Commit Guidelines](#commit-guidelines)

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Google Gemini API key
- Git

### Setup

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Install dependencies: `bun install`
4. Create `.env.local` with your `GEMINI_API_KEY`
5. Run the dev server: `bun run dev`
6. Verify tests pass: `bun run test`

## Development Workflow

### Branching Strategy

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Create bugfix branch
git checkout -b fix/bug-description

# Create content branch for cards/content
git checkout -b content/new-role-or-scenarios
```

### Development Cycle

1. **Make changes** - Edit code, add features, fix bugs
2. **Test locally** - Run `bun run test` (see [TESTING.md](TESTING.md))
3. **Verify visually** - Test in browser at `http://localhost:3000`
4. **Commit** - Follow commit message guidelines
5. **Push** - Push to your fork
6. **Pull Request** - Create PR with description

### Before Submitting

- [ ] All tests pass: `bun run test`
- [ ] No TypeScript errors: `bun run typecheck`
- [ ] Code follows style guidelines
- [ ] New features have tests
- [ ] Documentation updated (if needed)

## Code Standards

### TypeScript

**Strict mode required.** All code must pass TypeScript checks.

```typescript
// ✅ Good - Explicit types, interfaces
type GameAction = { type: 'CHOICE_MADE'; direction: 'LEFT' | 'RIGHT' };

interface CardProps {
  card: Card;
  onSwipe: (direction: 'LEFT' | 'RIGHT') => void;
}

// ❌ Bad - Implicit any
const handleClick = (data) => { ... };
```

### React Components

```typescript
// ✅ Good - Functional components, explicit return type
interface Props {
  title: string;
  children: React.ReactNode;
}

const MyComponent: React.FC<Props> = ({ title, children }) => {
  return (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  );
};

MyComponent.displayName = 'MyComponent';
export default React.memo(MyComponent);
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `LayoutShell.tsx` |
| Hooks | camelCase with `use` | `useGameState.ts` |
| Utilities | camelCase | `formatBudget.ts` |
| Constants | SCREAMING_SNAKE | `INITIAL_BUDGET` |
| Types/Interfaces | PascalCase | `GameState`, `CardProps` |
| Enums | PascalCase | `GameStage`, `RoleType` |
| Test files | `*.spec.ts` | `swipe.spec.ts` |

### File Organization

```
src/
├── components/         # React components
├── hooks/             # Custom React hooks
├── services/          # External API services
├── utils/             # Helper functions
├── types.ts           # Shared TypeScript types
└── constants.ts       # Static data
```

### Styling (Tailwind CSS)

```typescript
// ✅ Good - Organized by category
className={`
  flex flex-col items-center justify-center
  w-full max-w-2xl
  p-6 md:p-8
  bg-slate-900 rounded-lg border border-slate-800
  transition-colors duration-200
  hover:border-cyan-500
`.trim()}

// ❌ Bad - Disorganized, inconsistent spacing
className="flex flex-col p-6 bg-slate-900 hover:border-cyan-500 w-full items-center justify-center max-w-2xl border border-slate-800 rounded-lg transition-colors duration-200 md:p-8"
```

## Adding Content

### Adding New Cards

Cards are defined in [`constants.ts`](constants.ts) within `ROLE_CARDS`.

**Card Template:**

```typescript
{
  id: 'role_uniqueId',           // Format: role_identifier
  source: AppSource.SLACK,       // IDE, SLACK, EMAIL, TERMINAL
  sender: 'Sender Name',
  context: 'Context/Subject',
  storyContext: 'Scene-setting narrative (optional)',
  text: 'The dilemma text',
  onRight: {
    label: 'Button Text',
    hype: 10,                    // -50 to +50
    heat: 20,                    // 0 to 50
    fine: 1000000,               // Budget penalty
    violation: 'Legal issue',
    lesson: 'Educational takeaway',
    feedback: {
      [PersonalityType.ROASTER]: 'V.E.R.A. response',
      [PersonalityType.ZEN_MASTER]: 'Bamboo response',
      [PersonalityType.LOVEBOMBER]: 'HYPE-BRO response'
    }
  },
  onLeft: {
    // Same structure as onRight
  }
}
```

**Guidelines:**
- IDs must be unique across all roles
- Real-world inspired scenarios preferred
- Balance stat changes (avoid game-breaking choices)
- Keep text under 200 characters
- Feedback responses under 150 characters
- Include educational lesson for each choice

### Adding a New Role

1. Add role to [`types.ts`](types.ts):
```typescript
export enum RoleType {
  // ... existing roles
  NEW_ROLE = 'NEW_ROLE'
}
```

2. Create card deck in [`constants.ts`](constants.ts):
```typescript
export const ROLE_CARDS: Record<RoleType, Card[]> = {
  // ... existing roles
  [RoleType.NEW_ROLE]: [
    // 5-8 cards
  ]
};
```

3. Add role button to role selection UI in [`App.tsx`](App.tsx)

### Adding Personalities

Personalities require:
1. Enum entry in [`types.ts`](types.ts)
2. Configuration in [`constants.ts`](types.ts)
3. Voice mapping in [`geminiService.ts`](services/geminiService.ts)
4. Feedback for every card choice

## Testing Requirements

### Required Tests

All changes must include appropriate tests:

| Change Type | Test Requirement |
|-------------|-----------------|
| New feature | E2E test covering user flow |
| UI changes | Visual regression test or snapshot update |
| Bug fix | Regression test preventing recurrence |
| Content (cards) | No new tests required |
| Refactoring | Existing tests must pass |

### Running Tests

```bash
# Run all tests
bun run test

# Run specific file
bun run test -- tests/your-test.spec.ts

# Debug mode
bun run test -- --debug

# Update snapshots
bun run test -- --update-snapshots
```

### Writing Tests

See [TESTING.md](TESTING.md) for detailed testing guide.

Key principles:
- Use `data-testid` attributes for selectors
- Test user-visible behavior, not implementation
- Keep tests independent
- Use navigation helpers for setup

## Commit Guidelines

### Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

| Type | Use For |
|------|---------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Formatting, semicolons, etc |
| `refactor` | Code restructuring |
| `test` | Adding/updating tests |
| `chore` | Build, dependencies, etc |

### Examples

```
feat(cards): add three new development scenarios

Add cards covering supply chain attacks, API key leaks,
and shadow AI usage in production.

fix(swipe): resolve card sticking on rapid swipes

docs(readme): update setup instructions for Windows

test(boss): add visual regression for boss fight
```

### Commit Frequency

- Commit logical units of work
- Don't commit broken code
- Push commits to your fork regularly

## Pull Request Process

1. **Create PR** from your fork to main repository
2. **Fill template** - Describe changes, link issues
3. **Verify CI** - All checks must pass
4. **Request review** - At least one approval required
5. **Address feedback** - Make requested changes
6. **Merge** - Squash merge when approved

### PR Description Template

```markdown
## Changes
Brief description of what changed and why.

## Testing
- [ ] Tests added/updated
- [ ] Manual testing completed
- [ ] Visual regression checked

## Screenshots (if UI changes)
Before/after screenshots

## Checklist
- [ ] Code follows style guidelines
- [ ] TypeScript compiles without errors
- [ ] All tests pass
- [ ] Documentation updated (if needed)
```

## Questions?

- Open an issue for discussion
- Check existing documentation
- Review closed PRs for examples

Thank you for contributing! 🎮
