import {
    appendUserMessage,
    appendBotMessage,
    initConversations,
    sendCreateConversationRequest,
    clearMessages
} from "./chat-panel";

let currentConversationIndex = 0;

export async function getCurrentConversationIndex() {
    
    return currentConversationIndex;
}

async function appendConversationLabel(title: string, index: number) {
    const conversationList = document.querySelector(".conversation-list") as HTMLElement;
    const label = document.createElement("label");
    label.textContent = `${index + 1}. ${title}`;
    label.title = label.textContent as string;

    // Append label to the list
    conversationList.appendChild(label);

    // Update the index of each conversation label
    const labels = Array.from(conversationList.children) as HTMLLabelElement[];

    labels.forEach((label, index) => {
        label.textContent = `${index + 1}. ${label.textContent?.replace(/^\d+\.\s/, "")}`;
    });

    label.addEventListener("click", async () => {
        currentConversationIndex = Array.from(conversationList.children).indexOf(label);
        await clearMessages().then();
        await fetchAppendMessages(currentConversationIndex, false);
        console.log("index: ", currentConversationIndex);
    });
}

function updateConversationLabels() {
    const conversationList = document.querySelector(".conversation-list") as HTMLElement;
    const labels = Array.from(conversationList.children) as HTMLLabelElement[];

    labels.forEach((label, index) => {
        label.textContent = `${index + 1}. ${label.textContent?.replace(/^\d+\.\s/, "")}`;
    });
}

export async function replaceConversationLabel(index: number, title: string) {
    const conversationList = document.querySelector(
        ".conversation-list"
    ) as HTMLElement;
    const label = conversationList.children[index] as HTMLLabelElement;
    // console.log(title);
    label.textContent = `${index + 1}. ${title}`;
}

async function clearConversationLabels() {
    const conversationList = document.querySelector(
        ".conversation-list"
    ) as HTMLElement;
    conversationList.innerHTML = "";
}

async function fetchAppendMessages(index_: number = 0, appendConversationLabels: boolean = false) {
    const statusLabel = document.createElement("label") as HTMLLabelElement;
    const panel = document.querySelector(".chat-panel") as HTMLElement;
    // statusLabel.textContent = "Fetching messages...";
    panel.appendChild(statusLabel);


    const conversations = await initConversations();

    if (appendConversationLabels){
        conversations.forEach((conv, index) => {
            appendConversationLabel(conv.title && conv.title !== "" ? conv.title : "- - -", index);
        });
    }

    if (conversations.length === 0) {
        console.error("No conversations found.");
        statusLabel.textContent = "No messages yet.";

} else {
        panel.removeChild(statusLabel);
        conversations[index_].messages.forEach((msg) => {
            if (msg.role === "user") {
                appendUserMessage(msg.text);
            } else {
                appendBotMessage(msg.text);
            }
        });
    }
}

// Move event listener setup into a function
function setupEventListeners() {
    const submitButton = document.querySelector(
        ".conversation-list-panel > button"
    ) as HTMLButtonElement;

    submitButton.addEventListener("click", async () => {
        // const conversationList = document.querySelector(".conversation-list") as HTMLElement;
        const conversations = await initConversations();

        const currentConversationIndex = await getCurrentConversationIndex() as number;

        for (const con in conversations) {
            if (conversations[currentConversationIndex].messages.length === 0) {
                alert("Empty conversation encountered. Please insert prompt there.");
                return;
            }
        }
        

        await sendCreateConversationRequest().then(clearMessages).then(clearConversationLabels);
        await fetchAppendMessages(currentConversationIndex, true);
        
        

        // sendCreateConversationRequest().then(clearMessages);

        // const labels = document.querySelectorAll(
        //     ".conversation-list > label"
        // ) as NodeListOf<HTMLLabelElement>;
        // appendConversationLabel("---", labels.length);
    });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    fetchAppendMessages(0, true);
    setupEventListeners();
});
