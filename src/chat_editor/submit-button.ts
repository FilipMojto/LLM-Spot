import {
  appendBotMessage,
  appendUserMessage,
  initConversations,
} from "./chat-panel";
import { Message } from "./types";
import { replaceConversationLabel, getCurrentConversationIndex } from "./chat-history";


const submitIcon = document.getElementById("submit-icon") as HTMLElement;
const promptInput = document.getElementById("prompt") as HTMLInputElement;
const promptForm = document.getElementById("prompt-form") as HTMLFormElement;
  
promptForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  console.log("submitting form");
  try {
    const promptForm = document.getElementById("prompt-form") as HTMLFormElement;
    const prompt = promptInput.value.trim();
    if (!prompt) {
      alert("Please enter a prompt.");
      return;
    }

    const formData = new FormData(promptForm); // Create a FormData object
    const formDataMap: Record<string, string> = {};

    // Iterate over form entries
    formData.forEach((value, key) => {
      formDataMap[key] = value.toString(); // Convert value to string if needed
    });




    await appendUserMessage(prompt);
    const botMessage = await appendBotMessage("Generating response...");

    promptInput.value = "";

    let conversations = await initConversations();
    const conversation_id = conversations[await getCurrentConversationIndex() as number].id;

    console.log(formDataMap["pmax-tokens"]);
    const response = await fetch("http://127.0.0.1:5000/generate_text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Explicitly set the content type
      },
      body: JSON.stringify({
        conversation_id,
        prompt: formDataMap["pprompt"], // Pass the actual prompt
        model: formDataMap["pmodel"], // Include the model (if applicable)
        temperature: parseFloat(
          formDataMap["ptemperature"] || 
          (document.querySelector("input[name='ptemperature']")?.getAttribute("placeholder") || "0.7")
        ), // Default to placeholder or 0.7
        maxTokens: parseInt(
          formDataMap["pmax-tokens"] || 
          (document.querySelector("input[name='pmax-tokens']")?.getAttribute("placeholder") || "1000"), 
          10
        ), // Default to placeholder or 1000
        context: formDataMap["pcontext"] || 
          document.querySelector("textarea[name='pcontext']")?.getAttribute("placeholder") || "", // Default to placeholder or empty string
      }),
    });



    // const response = await fetch("http://127.0.0.1:5000/generate_text", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     prompt,
    //     conversation_id,
    //   }),
    // });

    if (!response.ok) {
      // Extract error details from the response body
      const errorData = await response.json();  // This parses the JSON body
      console.log(errorData);
      // Check if there is an error message in the response
      const errorMessage = errorData.error ? errorData.error.message : "Unknown error occurred";
      const errorInfo = errorData.error ? errorData.error.info : "No additional information available";

      // Optionally, display a simplified version of the error message
      alert("Error: " + errorMessage + "\n" + errorInfo);  // This will show only the message in the alert
    
      // Throw an error with the message if you want to catch it later
      throw new Error(errorMessage);  // You can use this for logging or further processing
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

});


document.addEventListener("DOMContentLoaded", () => {

  submitIcon.addEventListener("click", async (e: MouseEvent) => {
    e.preventDefault();
    console.log("Submitting form via click");
    promptForm.dispatchEvent(new Event("submit", { cancelable: true }));
  });
  
  promptInput.addEventListener("keydown", async (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      console.log("Submitting form via Enter");
      promptForm.dispatchEvent(new Event("submit", { cancelable: true }));
    }
  });
});