import {
    appendUserMessage,
    appendBotMessage,
    clearMessages
} from "../chat_panel/chat-panel";

import { Conversation } from "../../types";
import { initConversations, createChat } from "../../server";


let currentConversationIndex = 0;

export async function getCurrentConversationIndex() {
    return currentConversationIndex;
}

async function appendChatLabel(title: string, index: number) {
    const conversationList = document.querySelector(
        ".conversation-list"
    ) as HTMLElement;
    const label = document.createElement("label");
    label.textContent = `${index + 1}. ${title}`;
    label.title = label.textContent as string;

    // Append label to the list
    conversationList.appendChild(label);

    // Update the index of each conversation label
    const labels = Array.from(conversationList.children) as HTMLLabelElement[];

    labels.forEach((label, index) => {
        label.textContent = `${index + 1}. ${label.textContent?.replace(
            /^\d+\.\s/,
            ""
        )}`;
    });

    label.addEventListener("click", async () => {
        currentConversationIndex = Array.from(conversationList.children).indexOf(
            label
        );
        await clearMessages();
        // await fillChats(await initConversations(), false);
        await fillMessages(await initConversations(), currentConversationIndex);
        console.log("index: ", currentConversationIndex);
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

async function fillChats(chats: Conversation[] = [],
    appendChatLabels: boolean = false
): Promise<void> {
    
    // const conversations = await initConversations();

    if (appendChatLabels) {
        chats.forEach((chat, index) => {
            appendChatLabel(
                chat.title && chat.title !== "" ? chat.title : "- - -",
                index
            );
        });
    }

    // if (conversations.length === 0) {
    //     statusLabel.style.display = "block";
    //     console.error("No conversations found.");
    //     statusLabel.textContent = "Your chats will appear in this panel";
    // } else {
    //     statusLabel.style.display = "none";
    //     conversations[index_].messages.forEach((msg) => {
    //         if (msg.role === "user") {
    //             appendUserMessage(msg.text);
    //         } else {
    //             appendBotMessage(msg.text);
    //         }
    //     });
    // }
}

async function fillMessages(conversations: Conversation[], index: number)
: Promise<void>
{
    // const statusLabel = document.querySelector(
    //     ".chat-panel > label:first-child"
    // ) as HTMLLabelElement;

    if (conversations.length === 0) {
        // statusLabel.style.display = "block";
        console.error("No conversations found.");
        // statusLabel.textContent = "Your chats will appear in this panel";
    } else {
        // statusLabel.style.display = "none";
        conversations[index].messages.forEach((msg) => {
            if (msg.role === "user") {
                appendUserMessage(msg.text);
            } else {
                appendBotMessage(msg.text);
            }
        });
    }
}
// Move event listener setup into a function
function setupEventListener() {
    const submitButton = document.querySelector(
        ".conversation-list-panel > button"
    ) as HTMLButtonElement;

    submitButton.addEventListener("click", async () => {
        let conversations = await initConversations();
        const currentConversationIndex =
            (await getCurrentConversationIndex()) as number;

        for (const con of conversations) {
            if (con.messages.length === 0) {
                alert("Empty conversation encountered. Please insert prompt there.");
                return;
            }
        }

        // await createChat();
        conversations = await createChat().then(await initConversations);

        await clearMessages().then(await clearConversationLabels);
        await fillChats(conversations, true);
    });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
    const chats = await initConversations();

    await fillChats(chats, true);
    await fillMessages(chats, 0).then(await setupEventListener);
});
