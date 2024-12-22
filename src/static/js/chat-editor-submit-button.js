document.getElementById("submit-icon").addEventListener("click", () => {
    const prompt = document.getElementById("prompt").value.trim();

    if (prompt) {
        // Find the chat panel
        const chatPanel = document.querySelector(".chat-panel");

        // Create a new chat-item div
        const newChatItem = chatPanel.createElement("div");
        newChatItem.className = "container-fluid chat-item-left";

        // Create a label to hold the message text
        const messageLabel = chatPanel.createElement("label");
        messageLabel.className = "message-text m-3";
        messageLabel.textContent = prompt;

        // Append the label to the new chat-item
        newChatItem.appendChild(messageLabel);

        // Append the new chat-item to the chat panel
        chatPanel.appendChild(newChatItem);

        // Scroll to the bottom of the chat panel
        chatPanel.scrollTop = chatPanel.scrollHeight;

        // Clear the textarea
        document.getElementById("prompt").value = "";
    }
});