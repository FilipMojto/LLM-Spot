import os
import datetime
import logging

from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

from models import *
from models.base import LLM

from models.logging.logging import log_interaction
from typing import List

load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow all origins

logger = logging.getLogger(__name__)
# Initialize your OpenAIWrapper
api_key = os.getenv("OPENAI_API_KEY")
openai_wrapper = openaiwrapper.OpenAIWrapper(api_key)
anthropic_wrapper = anthropicwrapper.AnthropicWrapper()
google_wrapper = googlewrapper.GoogleWrapper()

messages: List[str] = []


@app.route("/")
def home():
    return "<p>Hello, World!</p>"


@app.route('/models/<string:service>', methods=['GET'])
def models(service):
    match service:
        case 'openai':
            return jsonify(openai_wrapper.MODELS)  # Convert the list to JSON
        case 'anthropic':
            return jsonify(anthropic_wrapper.MODELS)
        case 'google':
            return jsonify(google_wrapper.MODELS)
        case _:
            return jsonify({"error": "Service not supported"}), 404


@app.route("/generate", methods=["POST"])
def generate():
    """Generate text response using LLM based on user input.
    
    This endpoint handles text generation requests by:
    1. Extracting parameters from the request
    2. Building conversation context
    3. Calling the OpenAI API
    4. Logging the interaction
    5. Returning the formatted response
    
    Request JSON Parameters:
        prompt (str): The user's input text
        model (str, optional): LLM model to use (default: gpt-3.5-turbo)
        temperature (float, optional): Creativity of response (default: LLM.DEF_TEMPERATURE)
        maxTokens (int, optional): Maximum response length (default: LLM.DEF_MAX_OOUTPUT_TOKENS)
        context (str, optional): System context/prompt (default: LLM.DEF_CONTEXT)
    
    Returns:
        JSON: Contains generated text content and role identifier
        
    Raises:
        500: If text generation fails
    """
    logger.info('Started text generation request')
    
    # Extract request parameters with defaults
    data = request.json
    prompt = data.get("prompt", "")
    model = data.get("model", "gpt-3.5-turbo")
    temperature = float(data.get("temperature", LLM.DEF_TEMPERATURE))
    output_tokens = int(data.get("maxTokens", LLM.DEF_MAX_OOUTPUT_TOKENS))
    context = data.get("context", LLM.DEF_CONTEXT)
    
    # Track request timestamp
    created_at = datetime.datetime.now()
    
    # Build full prompt with conversation history
    conversation_history = " ".join(messages)
    full_prompt = conversation_history + " " + prompt

    try:
        # Generate response from LLM
        response = openai_wrapper.generate_text(
            command=full_prompt,
            model=model, 
            max_tokens=output_tokens,
            temperature=temperature,
            context=context
        )
        
        # Log the successful interaction
        log_interaction(
            model=model,
            prompt=prompt,
            system=context,
            created_at=created_at,
            temperature=temperature,
            max_tokens=output_tokens,
            response=response
        )

        messages.append(prompt)
        messages.append(response.text_content)
        
        # Return formatted response
        return jsonify({
            "content": response.text_content,
            "role": "system"
        })
        
    except Exception as e:
        # Log and return any errors that occur
        logger.error(f"Failed to generate text: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)