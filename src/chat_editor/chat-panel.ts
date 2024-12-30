import { marked } from "marked";
import hljs from "highlight.js";

import { Conversation } from "./types";

/**
 * Appends a user message to the chat panel and formats it using markdown.
 *
 * This function processes the message text through a markdown parser with custom rendering
 * for code blocks, appends it to the chat panel, and handles special formatting for newlines
 * and tabs. It also toggles the chat panel's empty-list label if it exists.
 *
 * @param message - The message text to be appended to the chat panel
 * @returns Promise<HTMLElement> - A promise that resolves to the newly created message element
 *
 * @remarks
 * The function performs the following operations:
 * - Sets up custom markdown rendering for code blocks
 * - Removes any existing label element in the chat panel
 * - Creates a new message element with 'chat-item-left' class
 * - Parses the message using markdown and handles special characters
 * - Appends the message to the chat panel
 * - Auto-scrolls to the bottom of the chat panel
 */
export async function appendUserMessage(message: string): Promise<HTMLElement> {
  // Custom renderer for code blocks
  const renderer = new marked.Renderer();
  renderer.code = ({
    text,
    lang,
    escaped,
  }: {
    text: string;
    lang?: string;
    escaped?: boolean;
  }) => {
    const language = lang || "plaintext";
    return `<pre class="code-block"><code class="language-${language}">${text}</code></pre>`;
  };

  marked.setOptions({
    renderer: renderer,
    breaks: false, // Convert newlines to <br>
  });

  // Display the user's input
  const userMessage = document.createElement("div");
  const chatPanel = document.querySelector(".chat-panel") as HTMLElement;

  const labelElement = chatPanel.querySelector(
    ":scope > label"
  ) as HTMLLabelElement;

  // Remove the label element if it exists
  if (labelElement) {
    chatPanel.removeChild(labelElement);
  }

  userMessage.className = "container-fluid chat-item-left";
  userMessage.innerHTML = (marked.parse(message) as String)
    .replace(/\\n/g, "<br>")
    .replace(/\\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
  chatPanel.appendChild(userMessage);
  chatPanel.scrollTop = chatPanel.scrollHeight;

  return userMessage;
}

export async function appendBotMessage(message: string): Promise<HTMLElement> {
  const chatPanel = document.querySelector(".chat-panel") as HTMLElement;

  const loadingMessage = document.createElement("div");
  loadingMessage.className = "container-fluid chat-item-right";
  loadingMessage.innerHTML = "Generating response...";

  // Update the response with formatted HTML
  const parsedContent = marked.parse(message.trim());

  // Ensure `parsedContent` is a string before calling `replace`
  if (typeof parsedContent === "string") {
    loadingMessage.innerHTML = parsedContent;
    // console.log(parsedContent);
  } else {
    throw new Error("Expected marked.parseInline to return a string.");
  }

  chatPanel.appendChild(loadingMessage);
  hljs.highlightAll();
  chatPanel.style;
  // hljs.configure(Partial)
  chatPanel.scrollTop = chatPanel.scrollHeight;

  return loadingMessage;
}

export async function clearMessages() {
  const chatPanel = document.querySelector(".chat-panel") as HTMLElement;
  chatPanel.innerHTML = "";

  // const label = document.createElement("label");
  // // label.textContent = "No messages yet.";
  // chatPanel.appendChild(label);
}

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

export async function sendCreateConversationRequest(): Promise<Conversation | null> {
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

    // If no conversations exist, create a new one
    if (!conversations || conversations.length === 0) {
      const newConversation = await sendCreateConversationRequest();
      return newConversation ? [newConversation] : [];
    }

    return conversations;
  } catch (error) {
    console.error("Error initializing conversations:", error);
    return [];
  }
}
