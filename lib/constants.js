// const API_URL = "https://understandably-subquadrangular-keven.ngrok-free.dev";

DEBUG = true;

// Debug Configuration
const debug_clientID = "rOV7OsXQo9TE9nWzWk03E6h1AmTNspn0QwMhTyhx";
const debug_redirectURI = "http://localhost:3000/wids-2025/process-login/";
const debug_API_URL = "http://127.0.0.1:8000/apis-wids2025";

// Production Configuration
const prod_API_URL = "https://ugac.gymkhana.iitb.ac.in/apis-wids2025";
const prod_clientID = "4txgVb4MLcFKKtb2kt0ZkpqO7SNEBUMg38vFjzHg"; 
const prod_redirectURI = "https://ugac.gymkhana.iitb.ac.in/wids-2025/process-login/";

exports.API_URL = (DEBUG) ? debug_API_URL : prod_API_URL;
exports.clientID = (DEBUG) ? debug_clientID : prod_clientID;
exports.redirectURI = (DEBUG) ? debug_redirectURI : prod_redirectURI;