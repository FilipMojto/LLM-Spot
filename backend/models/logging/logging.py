
from models.base import Response
from datetime import datetime
import json
import uuid

DEF_LOG_FILE_PATH = './models/logging/logs.json'

def log_interaction(model: str, prompt: str, system: str, created_at: datetime,
                    temperature: float, max_tokens: int,
                    response: Response, log_file: str = DEF_LOG_FILE_PATH):
    # Ensure the datetime is serialized in the desired format
    # created_at_str = created_at.strftime("%d/%m/%Y, %H:%M:%S")

    # Format the interaction
    interaction = {
        "uuid": str(uuid.uuid4()),
        "model": model,
        "chats": [
            {
                "prompt": prompt,
                "role": "user",
                "system": system,
                "temperature": temperature,
                "max_tokens": max_tokens,
                "created_at": created_at.strftime("%d/%m/%Y, %H:%M:%S")
            },
            {
                "text_content": response.text_content,
                "role": "assistant",
                "created_at": response.created_at.strftime("%d/%m/%Y, %H:%M:%S")
            }
        ]
    }

    # Try to load existing log file
    try:
        with open(log_file, "r") as file:
            data = json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        # If the file doesn't exist or is invalid, start a new structure
        data = {"name": "user-llm-chat-interactions", "interactions": []}

    # Append the new interaction
    data["interactions"].append(interaction)

    # Write back the updated data
    with open(log_file, "w") as file:
        json.dump(data, file, indent=4)

    print(f"Interaction logged to {log_file}")