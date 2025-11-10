// const API_URL = "https://understandably-subquadrangular-keven.ngrok-free.dev";

DEBUG = false;

if (DEBUG) {
    const clientID = "7fd2hw5HewaGKKDGzsWghCpcBonwe5ytqsNPH0I3";
    const redirectURI = "http://localhost:3000/wids-2025/process-login/";
    const API_URL = "http://127.0.0.1:8000/apis-wids2025";
} else {
    const API_URL = "http://ugac.gymkhana.iitb.ac.in/apis-wids2025";
    const clientID = "4txgVb4MLcFKKtb2kt0ZkpqO7SNEBUMg38vFjzHg"; 
    const redirectURI = "http://localhost:3000/wids-2025/process-login/";
} 

exports.API_URL = API_URL;
exports.clientID = clientID;
exports.redirectURI = redirectURI;