// Export an empty object to make this file a module
export{};

import { BACKEND_SERVER_PROTOCOL, BACKEND_SERVER_IP, BACKEND_SERVER_PORT } from "./constants";

const KEEP_ALIVE_INTERVAL = 30000; // 30 seconds

// Wait for the DOM to be fully loaded before executing the code
document.addEventListener("DOMContentLoaded", async () => {
	// Define a function to check the server's health status
	async function checkServerStatus() {
		// Construct the URL using the constants
		const serverUrl = `${BACKEND_SERVER_PROTOCOL}://${BACKEND_SERVER_IP}:${BACKEND_SERVER_PORT}/health_check`;
		
		// Make a GET request to the health check endpoint
		fetch(serverUrl)
			.then(response => {
				// If the server responds with a successful status code
				if (response.ok) {
					console.log("Server is alive!");
				} else {
					// If the server responds with an error status code
					console.error("Server returned error: " + response.status);
					alert("Server is down!");
				}
			})
			.catch(error => {
				// If the request fails due to network error or server being unreachable
				console.error("Network error or server is down: ", error);
				alert("Server is down or network error occurred.");
			});
	}

	// Run the server status check every 30 seconds (30000 milliseconds)
	setInterval(checkServerStatus, KEEP_ALIVE_INTERVAL);
});