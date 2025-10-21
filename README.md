# Youmio Testnet Migration

A web application for Youmio chain testnet migration with badge minting, faucet functionality, and Limbo AI chat integration.

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/your-site-name/deploys)

> Note: Replace `your-badge-id` and `your-site-name` with your actual Netlify site information.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Key Features Implementation](#key-features-implementation)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Testnet Badge Migration**: Migrate your testnet participation badge to mainnet
- **Faucet Functionality**: Get test tokens for the Youmio testnet
- **Limbo AI Chat**: Interactive chat widget with AI personality
- **Wallet Integration**: Connect with Ethereum wallets via Wagmi
- **SBT Minting**: Mint Soulbound Tokens (SBTs) on the Youmio chain
- **Responsive Design**: Works on both desktop and mobile devices

## Prerequisites

- Node.js >= 18.0.0
- pnpm package manager
- Ethereum wallet (MetaMask or similar)
- Access to Youmio testnet

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/youmio-testnet-migration.git
   cd youmio-testnet-migration
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:8000`

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Production build with Vite
- `pnpm lint` - Run ESLint on all files
- `pnpm preview` - Preview production build locally
- `pnpm chunk` - Process allowlist chunks
- `pnpm process-allowlist` - Process allowlist data
- `pnpm deploy` - Deploy to Netlify production

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Netlify configuration (optional for local development)
NETLIFY_SITE_ID=your-site-id
NETLIFY_AUTH_TOKEN=your-auth-token

# Blockchain configuration
VITE_RPC_URL=https://subnets.avax.network/youtest/testnet/rpc
VITE_CHAIN_ID=your-chain-id
```

### Code Style and Quality

This project follows strict TypeScript and modern React patterns:

- Strict TypeScript mode enabled
- Functional components with hooks
- Absolute imports when possible
- Named imports over default imports
- ESLint for code quality enforcement
- Prettier for code formatting

Refer to [AGENTS.md](AGENTS.md) for detailed code style guidelines.

## Building for Production

To create a production build:

```bash
pnpm build
```

To preview the production build locally:

```bash
pnpm preview
```

### Deployment

This project is configured for deployment on Netlify:

1. Connect your GitHub repository to Netlify
2. Netlify will automatically build and deploy on pushes to the main branch
3. Environment variables can be set in the Netlify dashboard

For manual deployment:

```bash
pnpm deploy
```

### Code Quality

Run the linter to check for code quality issues:

```bash
pnpm lint
```

The project uses ESLint with TypeScript and React plugins to enforce code quality standards. 
Currently, there are some linting issues that need to be addressed (51 errors found).

Note: Unit tests and integration tests are not yet configured for this project.

## Project Structure

```
youmio-testnet-migration/
├── public/                        # Static assets
│   ├── *.png                     # Image assets (logo, badges, etc.)
├── src/
│   ├── components/               # React components
│   │   ├── pages/                # Page components
│   │   │   ├── TestnetPage.tsx   # Main testnet page
│   │   │   └── testnet.css       # Page-specific styles
│   │   ├── ChatWidget.tsx        # Limbo AI chat component
│   │   ├── WalletConnectModal.tsx # Wallet connection UI
│   │   └── faucet-cooldown.tsx   # Faucet cooldown timer
│   ├── functions/                # Netlify functions (backend)
│   │   ├── allowlist.mts         # Allowlist management
│   │   ├── auth.mts              # Authentication functions
│   │   ├── chat.mts              # Chat functionality
│   │   ├── faucet.mts            # Faucet token distribution
│   │   ├── health.js             # Health check endpoint
│   │   ├── image.js              # Image processing
│   │   ├── kells-data.js         # Kells data processing
│   │   ├── messages.mts          # Message handling
│   │   ├── metadata.mts          # Metadata generation
│   │   ├── mint-store.js         # Mint data storage
│   │   └── signature.mts         # Signature verification
│   ├── hooks/                    # Custom React hooks
│   │   ├── use-personality.ts    # AI personality hook
│   │   └── use-session.ts        # Session management hook
│   ├── html/                     # HTML templates
│   │   ├── index.html            # Main HTML template
│   │   ├── limbo-admin.html      # Admin interface
│   │   ├── limbo-chatbot.html    # Chatbot interface
│   │   ├── testnet.html          # Testnet interface
│   │   └── testnet-status.html   # Testnet status page
│   ├── routes/                   # TanStack Router routes
│   │   ├── __root.tsx            # Root layout component
│   │   └── index.tsx             # Index route
│   ├── types/                    # TypeScript types
│   ├── utils/                    # Utility functions
│   │   ├── contract/             # Smart contract utilities
│   │   │   ├── abis/             # Contract ABIs
│   │   │   └── sbt.ts            # SBT utilities
│   │   ├── allowlist-store.ts    # Allowlist data management
│   │   ├── auth-store.ts         # Authentication utilities
│   │   ├── chain.ts              # Chain configuration
│   │   ├── chat-api.ts           # Chat API utilities
│   │   ├── faucet.ts             # Faucet utilities
│   │   ├── hash.ts               # Hash utilities
│   │   ├── message-store.ts      # Message storage
│   │   ├── middlewares.ts        # Middleware functions
│   │   ├── process-allowlist.mjs # Allowlist processing
│   │   ├── process_logs.py       # Log processing script
│   │   ├── prompt.ts             # AI prompt utilities
│   │   ├── signature.ts          # Signature utilities
│   │   ├── split-allowlist.cjs   # Allowlist splitting utility
│   │   └── time.ts               # Time utilities
│   ├── wagmi/                    # Web3 configuration
│   │   ├── chain.ts              # Chain configuration
│   │   └── config.ts             # Wagmi configuration
│   ├── main.tsx                  # Application entry point
│   ├── routeTree.gen.ts          # Generated route tree
│   ├── index.css                 # Global styles
│   └── toastify.css              # Toast notification styles
├── package.json                  # Project dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.js                # Vite configuration
├── netlify.toml                  # Netlify configuration
├── AGENTS.md                     # Agent configuration guidelines
└── README.md                     # This file
```

## Technologies Used

- **Frontend**: React 19 with TypeScript
- **Build System**: Vite
- **Routing**: TanStack Router
- **State Management**: TanStack Query
- **Web3 Integration**: Wagmi/Viem for Ethereum interactions
- **Backend**: Netlify Functions
- **Styling**: CSS with modern layout techniques
- **Blockchain**: Youmio Avalanche Subnet

## Key Features Implementation

### Wallet Connection

The application uses Wagmi for wallet integration, allowing users to connect their Ethereum wallets:

1. Click the "Connect Wallet" button
2. Select your preferred wallet provider
3. Approve the connection in your wallet
4. The application will automatically switch to the correct network

### Testnet Badge Migration

Users can migrate their testnet participation badges to mainnet:

1. Connect your wallet
2. Click "Migrate Testnet Badge to Mainnet"
3. Confirm the transaction in your wallet
4. View your migrated badge on OpenSea

### Faucet Functionality

Get test tokens for the Youmio testnet:

1. Connect your wallet
2. Click the "Get Test Tokens" button in the faucet module
3. Confirm the transaction in your wallet
4. Receive test tokens in your wallet

### Limbo AI Chat

Interact with the Limbo AI personality:

1. Type your message in the chat input
2. Send messages to interact with Limbo
3. Mint conversations as NFTs if desired

## Troubleshooting

### Common Issues

1. **Wallet Connection Problems**
   - Ensure you're using a compatible wallet (MetaMask recommended)
   - Check that you're on the correct network
   - Refresh the page if connection fails

2. **Faucet Not Working**
   - Check if you're on the correct testnet
   - Verify your wallet has sufficient gas
   - Wait for cooldown period if applicable

3. **Build Errors**
   - Run `pnpm install` to ensure all dependencies are installed
   - Check that Node.js version is >= 18.0.0
   - Clear pnpm cache with `pnpm store prune`

4. **Netlify Functions Not Working**
   - Ensure environment variables are set correctly
   - Check Netlify function logs for error details

5. **Linting Errors**
   - Run `pnpm lint` to see all linting issues
   - Fix unused variables and imports
   - Address undefined variables and missing dependencies

### Support

For additional help, join our Discord community or open an issue on GitHub.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

Please read [AGENTS.md](AGENTS.md) for information about our development standards and practices.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.