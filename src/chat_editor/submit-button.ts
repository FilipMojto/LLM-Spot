import { marked } from "marked";

document.addEventListener("DOMContentLoaded", () => {
    const submitIcon = document.getElementById("submit-icon") as HTMLElement;
    const promptInput = document.getElementById("prompt") as HTMLInputElement;

    submitIcon.addEventListener("click", async (e: MouseEvent) => {
        
        // Configure Markdown parsing options
        marked.setOptions({
            // sanitize: true, // Prevent raw HTML injection
            breaks: true,   // Convert newlines to <br>
        });
        
        e.preventDefault();

        // Get the prompt and preserve newlines and tabs
        const prompt = promptInput.value.trim();
        promptInput.value = "";

        const temperatureInput = document.querySelector<HTMLInputElement>("#optional-tuning-params > #temperature-container > .row div:nth-of-type(2) > input");
        const maxTokensInput = document.querySelector<HTMLInputElement>('#optional-tuning-params > #max-tokens-container > input');

        if (!prompt) {
            alert("Please enter a prompt.");
            return;
        }

        if (!temperatureInput || !maxTokensInput) {
            alert("Missing tuning parameters. Ensure inputs are properly set up.");
            return;
        }

        const temperature = temperatureInput.value.trim();
        const maxTokens = maxTokensInput.value.trim();

        try {
            const chatPanel = document.querySelector(".chat-panel") as HTMLElement;
            if (!chatPanel) {
                throw new Error("Chat panel not found.");
            }

            const labelElement = chatPanel.querySelector(':scope > label') as HTMLLabelElement;

            // Remove the label element if it exists
            if (labelElement) {
                chatPanel.removeChild(labelElement);
            }

            // Display the user's input
            const userMessage = document.createElement("div");
            userMessage.className = "container-fluid chat-item-left";
            userMessage.innerHTML = (marked.parse(prompt) as String).replace(/\\n/g, "<br>").replace(/\\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
            chatPanel.appendChild(userMessage);
            chatPanel.scrollTop = chatPanel.scrollHeight;

            // Display a loading indicator
            const loadingMessage = document.createElement("div");
            loadingMessage.className = "container-fluid chat-item-right";
            loadingMessage.innerHTML = 'Generating response...';
            chatPanel.appendChild(loadingMessage);
            chatPanel.scrollTop = chatPanel.scrollHeight;

            const response = await fetch("http://127.0.0.1:5000/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, temperature, maxTokens }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            // Update the response with formatted HTML
            const parsedContent = marked.parseInline(result.content.trim());

            // Ensure `parsedContent` is a string before calling `replace`
            if (typeof parsedContent === "string") {
                loadingMessage.innerHTML = parsedContent
                    .replace(/\\n/g, "<br>")
                    .replace(/\n/g, "<br>")
                    .replace(/\\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
                    .replace(/<br>\s*(<p)/g, '$1');
            } else {
                throw new Error("Expected marked.parseInline to return a string.");
            }

            chatPanel.scrollTop = chatPanel.scrollHeight;

        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(`Error: ${error.message}`);
            } else {
                alert("An unknown error occurred.");
            }
        } finally {
            // Clear the input field
            promptInput.value = "";
        }
    });
});