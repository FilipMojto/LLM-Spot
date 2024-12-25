import os
import datetime

from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template
import markdown

from models import *
from models.base import LLM

from models.logging.logging import log_interaction

load_dotenv()

app = Flask(__name__)

# Initialize your OpenAIWrapper
api_key = os.getenv("OPENAI_API_KEY")
openai_wrapper = openaiwrapper.OpenAIWrapper(api_key)
anthropic_wrapper = anthropicwrapper.AnthropicWrapper()
google_wrapper = googlewrapper.GoogleWrapper()


@app.route("/")
def home():
    return render_template("index.html")


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


# @app.route("/generate", methods=["POST"])
# def generate():
#     data = request.json
#     prompt = data.get("prompt")
#     model = data.get("model", "gpt-3.5-turbo")
#     context = data.get("context", LLM.DEF_CONTEXT)  # Use the default context if none is provided.

#     try:
#         response = openai_wrapper.generate_text(
#             command=prompt,
#             model=model,
#             max_tokens=4096,
#             temperature=1,
#             context=context  # Explicitly pass the context.
#         )

#         # Replace newlines and tabs with their escape sequences for frontend interpretation
#         response.content = response.content.replace("\n", "\\n").replace("\t", "\\t")

#         # Replace bold and italic markers with corresponding HTML tags
#         # response.content = response.content.replace("*", "<b>").replace("</b><b>", "</b><b>")  # Ensure no nested <b>
#         # response.content = response.content.replace("_", "<i>").replace("</i><i>", "</i><i>")  # Ensure no nested <i>

#         return jsonify({"content": response.content, "role": response.role})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

@app.route("/generate", methods=["POST"])
def generate():
    data = request.json
    prompt = data.get("prompt", "")
    model = data.get("model", "gpt-3.5-turbo")
    temperature = float(data.get("temperature", LLM.DEF_TEMPERATURE))
    output_tokens = int(data.get("maxTokens", LLM.DEF_MAX_OOUTPUT_TOKENS))

    context = data.get("context", LLM.DEF_CONTEXT)  # Use the default context if none is provided.
    created_at = datetime.datetime.now()

    try:
        response = openai_wrapper.generate_text(
            command=prompt,
            model=model,
            max_tokens=output_tokens,
            temperature=temperature,
            context=context  # Explicitly pass the context.
        )

        # Convert Markdown to HTML
        html_content = markdown.markdown(
            response.text_content,
            extensions=[
                'markdown.extensions.fenced_code',
                'markdown.extensions.codehilite',  # For syntax highlighting
                'markdown.extensions.tables',     # Support for tables
                'markdown.extensions.sane_lists'  # Saner list handling
            ]
        )
        
        log_interaction(model=model, prompt=prompt, system=context, created_at=created_at,
                        temperature=temperature, max_tokens=output_tokens,
                        response=response)
        
        return jsonify({"content": html_content, "role": "system"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

if __name__ == "__main__":
    app.run(debug=True)