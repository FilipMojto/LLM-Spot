import { marked } from "marked";

document.addEventListener("DOMContentLoaded", () => {
    const submitIcon = document.getElementById("submit-icon") as HTMLElement;
    const promptInput = document.getElementById("prompt") as HTMLInputElement;
    const textarea = document.querySelector(".chat-submission-section > textarea") as HTMLTextAreaElement;

    // Custom renderer for code blocks
    const renderer = new marked.Renderer();
    renderer.code = ({ text, lang, escaped }: { text: string, lang?: string, escaped?: boolean }) => {
        const language = lang || 'plaintext';
        return `<pre><code class="language-${language}">${marked.parse(text)}</code></pre>`;
    };

    // Configure Markdown parsing options
    marked.setOptions({
        renderer: renderer,
        breaks: true,   // Convert newlines to <br>
    });

    // Add Shift+Enter handler
    textarea.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Enter" && e.shiftKey) {
            e.preventDefault();
            submitIcon.click();
        }
    });

    submitIcon.addEventListener("click", async (e: MouseEvent) => {
        
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
            const parsedContent = marked.parse(result.content.trim().replace(/```.*?\n/g, '').replace(/```/g, ''));
        
            // Ensure `parsedContent` is a string before calling `replace`
            if (typeof parsedContent === "string") {
                loadingMessage.innerHTML = parsedContent
                    // .replace(/\\n/g, "<br>")
                    // .replace(/\n/g, "<br>")
                    // .replace(/\\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
                    // .replace(/<br>\s*(<p)/g, '$1')
                    // .replace(/```[a-z]*\n/g, '') // Remove trailing backticks
                    // .replace(/```/g, ''); // Remove trailing backticks
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