// Export an empty object to make this file a module
export{};

import { BACKEND_SERVER_PROTOCOL, BACKEND_SERVER_IP, BACKEND_SERVER_PORT } from "./constants";
import { Conversation } from "./types";

const KEEP_ALIVE_INTERVAL = 30000; // 30 seconds

export async function fetchConversations(): Promise<Conversation[]> {
  try {
	const response = await fetch("http://127.0.0.1:5000/chats", {
	  method: "GET",
	  headers: { "Content-Type": "application/json" },
	});

	if (!response.ok) {
	  throw new Error(`HTTP error! status: ${response.status}`);
	}

	const conversations: Conversation[] = await response.json();
	console.log("conversations: ", conversations);
	if (!conversations) {
	  throw new Error("No conversations found.");
	} else {
	  // Sort conversations by created_at in descending order (newest first)
	  return conversations.sort(
		(a, b) =>
		  new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
	  );
	}
  } catch (error) {
	console.error("Error fetching messages:", error);
	return [];
  }
}

export async function createChat(): Promise<Conversation | null> {
	try {
		const response = await fetch("http://127.0.0.1:5000/chats/create", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error("Error creating new conversation:", error);
		return null;
	}
}

export async function initConversations(): Promise<Conversation[]> {
  try {
	// Try to fetch existing conversations
	const conversations = await fetchConversations();
	console.log(conversations);
	// If no conversations exist, create a new one
	if (!conversations || conversations.length === 0) {
	  const newConversation = await createChat();
	  return newConversation ? [newConversation] : [];
	}

	return conversations;
  } catch (error) {
	console.error("Error initializing conversations:", error);
	return [];
  }
}

export async function generateText(conversation_id: string,
	prompt: string,
	model: string,
	temperature: number,
	maxTokens: number,
	context: string
): Promise<Response> {
	const response = await fetch("http://127.0.0.1:5000/generate_text", {
		method: "POST",
		headers: {
		  "Content-Type": "application/json", // Explicitly set the content type
		},
		body: JSON.stringify({
		  conversation_id,
		  prompt: prompt, // Pass the actual prompt
		  model: model, // Include the model (if applicable)
		  temperature: temperature, // Default to placeholder or 0.7
		  maxTokens: maxTokens,// Default to placeholder or 1000
		  context: context// Default to placeholder or empty string
		}),
	  });

	return response;
}

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