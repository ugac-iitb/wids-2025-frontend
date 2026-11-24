// Environment-aware configuration
const isDev = process.env.NODE_ENV === "development";

// Set DEBUG to false for production by default, or override via NEXT_PUBLIC_DEBUG
const DEBUG = process.env.NEXT_PUBLIC_DEBUG !== undefined
    ? process.env.NEXT_PUBLIC_DEBUG === "true"
    : isDev;

// Development Configuration
const debug_clientID = process.env.NEXT_PUBLIC_CLIENT_ID || "iITLsMzyjKtk7X1bvPiYfeeijXYWk4ELRVMQbyAq";
const debug_redirectURI = process.env.NEXT_PUBLIC_REDIRECT_URI || "http://localhost:3000/wids-2025/process-login/";
const debug_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/apis-wids2025";

// Production Configuration
const prod_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://ugac.gymkhana.iitb.ac.in/apis-wids2025";
const prod_clientID = process.env.NEXT_PUBLIC_CLIENT_ID || "4txgVb4MLcFKKtb2kt0ZkpqO7SNEBUMg38vFjzHg";
const prod_redirectURI = process.env.NEXT_PUBLIC_REDIRECT_URI || "https://ugac.gymkhana.iitb.ac.in/wids-2025/process-login/";

exports.DEBUG = DEBUG;
exports.API_URL = DEBUG ? debug_API_URL : prod_API_URL;
exports.clientID = DEBUG ? debug_clientID : prod_clientID;
exports.redirectURI = DEBUG ? debug_redirectURI : prod_redirectURI;
