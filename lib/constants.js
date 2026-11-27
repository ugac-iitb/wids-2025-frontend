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

// Phase & Feature Flags
// Supported Phases:
//   - "mentor_registration" : Mentor registrations open (Current Version)
//   - "postmentorbreak"     : Mentor registrations closed, mentee prep (Next Phase)
//   - "mentee_registration" : Mentee registrations open
const PHASE = (
    process.env.NEXT_PUBLIC_PHASE ||
    process.env.PHASE ||
    "mentor_registration"
).toLowerCase().trim();

const envMentorReg = (
    process.env.NEXT_PUBLIC_MENTOR_REGISTRATION ||
    process.env.NEXT_PUBLIC_MENTOR_REGISTERATION ||
    process.env.mentor_registration ||
    process.env.mentor_registeration
);

const MENTOR_REGISTRATION_OPEN = envMentorReg !== undefined
    ? (String(envMentorReg).toLowerCase() === "true" || String(envMentorReg) === "1" || String(envMentorReg) === "yes")
    : (PHASE === "mentor_registration");

exports.DEBUG = DEBUG;
exports.API_URL = DEBUG ? debug_API_URL : prod_API_URL;
exports.clientID = DEBUG ? debug_clientID : prod_clientID;
exports.redirectURI = DEBUG ? debug_redirectURI : prod_redirectURI;
exports.PHASE = PHASE;
exports.MENTOR_REGISTRATION_OPEN = MENTOR_REGISTRATION_OPEN;
