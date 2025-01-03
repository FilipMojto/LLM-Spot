export interface Message {
    text: string;
    role: string;
    created_at: string;
    updated_at: string;
}

export interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    created_at: string;
    updated_at: string;
}
