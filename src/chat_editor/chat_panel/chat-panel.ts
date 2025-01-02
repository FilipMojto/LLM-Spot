import { marked } from "marked";
import hljs from "highlight.js";


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
    labelElement.style.display = "none";
    // chatPanel.removeChild(labelElement);
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
  chatPanel.scrollTop = chatPanel.scrollHeight;

  return loadingMessage;
}

export async function clearMessages() {
  const chatPanel = document.querySelector(".chat-panel") as HTMLElement;
  chatPanel.innerHTML = "";
}
