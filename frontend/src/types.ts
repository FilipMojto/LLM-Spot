// Message Interface
export interface Message {
    model: string;
    role: string;
    created_at: Date; // Using Date for datetime
    updated_at: Date; // Using Date for datetime
    // chunks: string[]; // Array of strings for chunks
}

// Response Interface
export interface Response extends Message {
    chunks: string[]; // Inheriting from Message, so this is already reflected
}

// Prompt Interface
export interface Prompt extends Message {
    instruct: string; // String for the instruction
    max_tokens: number; // Number for max_tokens
    output?: string; // Optional string for output
    context: string; // String for context, defaults to "Default Context"
    random: number; // Number for randomness
    vary_words: number; // Number for word variety
    repeat: number; // Number for repetitiveness
}

export function isPrompt(msg: Message): msg is Prompt {
    return (msg as Prompt).instruct !== undefined;
}

export function isResponse(msg: Message): msg is Response {
    return (msg as Response).chunks !== undefined;
}

// Conversation Interface
export interface Conversation {
    id: string; // UUID as a string in TypeScript
    title: string;
    messages: Message[]; // Array of Message
    created_at: Date; // Using Date for datetime
    updated_at: Date; // Using Date for datetime
}