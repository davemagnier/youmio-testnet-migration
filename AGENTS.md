# Youmio Testnet Migration - Agent Configuration

## Technology Stack
- React 19 with TypeScript
- Vite build system
- TanStack Router and Query
- Wagmi/Viem for Ethereum interactions
- Netlify Functions for backend

## Build/Lint/Test Commands
- `pnpm dev` - Start development server
- `pnpm build` - Production build with Vite
- `pnpm lint` - Run ESLint on all files
- `pnpm preview` - Preview production build locally

## Code Style Guidelines

### Imports
- Use absolute imports when possible (configured in tsconfig.json)
- Group imports: external libraries, then internal modules
- Use named imports over default imports where possible
- Keep imports sorted alphabetically within each group

### Formatting
- Strict TypeScript mode enabled
- Modern React with hooks (no class components)
- Functional components with TypeScript interfaces
- Prettier-style formatting (inferred from codebase)

### Types
- Use TypeScript for all components and utilities
- Define prop interfaces for all components
- Use strict typing for function parameters and return values
- Prefer `const` assertions for literal types

### Naming Conventions
- PascalCase for components (e.g., `TestnetPage.tsx`)
- camelCase for functions and variables
- UPPER_SNAKE_CASE for constants
- Descriptive variable names over abbreviations

### Error Handling
- Always handle async operations with try/catch
- Use React Query for server state management
- Implement proper error boundaries for UI errors
- Log errors appropriately but don't expose sensitive data

### React Patterns
- Use functional components with hooks
- Leverage TanStack Query for data fetching
- Implement proper component composition
- Use CSS modules or component-specific styling

### Web3 Integration
- Use Wagmi hooks for wallet interactions
- Handle chain switching gracefully
- Implement proper transaction status tracking
- Secure session management with signatures

This configuration is designed for agentic coding assistants to understand and contribute effectively to the codebase.