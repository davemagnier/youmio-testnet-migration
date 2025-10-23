/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SBT_CONTRACT_ADDRESS: string;
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}