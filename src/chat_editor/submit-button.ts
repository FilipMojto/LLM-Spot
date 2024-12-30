import {
  appendBotMessage,
  appendUserMessage,
  initConversations,
} from "./chat-panel";
import { Message } from "./types";
import { replaceConversationLabel, getCurrentConversationIndex } from "./chat-history";

// Extract submit logic to reusable function
async function handleSubmit(promptInput: HTMLInputElement) {
  try {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      alert("Please enter a prompt.");
      return;
    }

    await appendUserMessage(prompt);
    const botMessage = await appendBotMessage("Generating response...");

    promptInput.value = "";

    let conversations = await initConversations();
    const conversation_id = conversations[await getCurrentConversationIndex() as number].id;
    const serviceWidget: HTMLSelectElement = (document.getElementById('service-select-widget') as HTMLSelectElement)
    const service = serviceWidget.options[serviceWidget.selectedIndex].text;

    const modelWidget: HTMLSelectElement = (document.getElementById('model-select-widget') as HTMLSelectElement)

    const model: string = modelWidget.options[modelWidget.selectedIndex].text;

    // const temperatureSlider = 

    const response = await fetch("http://127.0.0.1:5000/generate_text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        conversation_id,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result: Message = await response.json();

    for (let i = 0; i < 5; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      conversations = await initConversations();
      const currConIndex = await getCurrentConversationIndex() as number;

      if (conversations[currConIndex].title) {
        // const currConIndex = await getCurrentConversationIndex() as number;

        await replaceConversationLabel(currConIndex, conversations[currConIndex].title);
        break;
      }
    }

    const panel = document.querySelector(".chat-panel") as HTMLElement;
    panel.scrollTop = panel.scrollHeight;
    panel.removeChild(botMessage);
    appendBotMessage(result.text);
  } catch (error) {
    console.error("Error in submit handler:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const submitIcon = document.getElementById("submit-icon") as HTMLElement;
  const promptInput = document.getElementById("prompt") as HTMLInputElement;

  // Click handler
  submitIcon.addEventListener("click", async (e: MouseEvent) => {
    e.preventDefault();
    // console.log("Submit button clicked");
    await handleSubmit(promptInput);
  });

  // Keyboard handler
  promptInput.addEventListener("keydown", async (e: KeyboardEvent) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      // console.log("Ctrl+Enter pressed");
      await handleSubmit(promptInput);
    }
  });
});