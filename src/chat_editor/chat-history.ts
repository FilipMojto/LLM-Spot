import { appendUserMessage, appendBotMessage } from "./interface";


interface Message {
	name: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: string;
}

async function fetchMessages(): Promise<Message[]> {
    try {
        const response = await fetch('http://127.0.0.1:5000/chats', {method: 'GET', headers: { 'Content-Type': 'application/json' }});
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const messages: Message[] = await response.json();
        return messages;
    } catch (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
}

// Usage example:
const messages = await fetchMessages();
const conversationList = document.querySelector('.conversation-list') as HTMLElement;

messages.forEach(msg => {

	if (msg.role === 'user') {
		appendUserMessage(msg.content);
	} else {
		appendBotMessage(msg.content);
	}

	const label = document.createElement('label');
	label.textContent = msg.name;

	conversationList.appendChild(label);

    // console.log(`${msg.role}: ${msg.content} (${msg.timestamp})`);
});

