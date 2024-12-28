import { marked, options } from "marked";
import hljs from 'highlight.js';

export async function appendUserMessage(message: string): Promise<HTMLElement> {
	// Custom renderer for code blocks
	const renderer = new marked.Renderer();
    renderer.code = ({ text, lang, escaped }: { text: string, lang?: string, escaped?: boolean }) => {
        const language = lang || 'plaintext';
        return `<pre class="code-block"><code class="language-${language}">${text}</code></pre>`;
    };
	
	marked.setOptions({
		renderer: renderer,
		breaks: false, // Convert newlines to <br>
	});


	// Display the user's input
	const userMessage = document.createElement("div");
	const chatPanel = document.querySelector(".chat-panel") as HTMLElement;

	const labelElement = chatPanel.querySelector(':scope > label') as HTMLLabelElement;

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
		console.log(parsedContent);

	} else {
		throw new Error("Expected marked.parseInline to return a string.");
	}

	chatPanel.appendChild(loadingMessage);
	hljs.highlightAll();
	chatPanel.style
	// hljs.configure(Partial)
	chatPanel.scrollTop = chatPanel.scrollHeight;

	return loadingMessage;
}