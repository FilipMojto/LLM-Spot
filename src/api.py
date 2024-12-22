import os

from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template
from models.openaiwrapper import OpenAIWrapper
from models.base import LLM

load_dotenv()

app = Flask(__name__)

# Initialize your OpenAIWrapper
api_key = os.getenv("OPENAI_API_KEY")
openai_wrapper = OpenAIWrapper(api_key)




@app.route("/")
def home():
    return render_template("index.html")


@app.route("/generate", methods=["POST"])
def generate():
    data = request.json
    prompt = data.get("prompt")
    model = data.get("model", "gpt-3.5-turbo")
    context = data.get("context", LLM.DEF_CONTEXT)  # Use the default context if none is provided.

    try:
        response = openai_wrapper.generate_text(
            command=prompt,
            model=model,
            max_tokens=4096,
            temperature=1,
            context=context  # Explicitly pass the context.
        )

        # Replace newlines and tabs with their escape sequences for frontend interpretation
        response.content = response.content.replace("\n", "\\n").replace("\t", "\\t")

        # Replace bold and italic markers with corresponding HTML tags
        response.content = response.content.replace("*", "<b>").replace("</b><b>", "</b><b>")  # Ensure no nested <b>
        response.content = response.content.replace("_", "<i>").replace("</i><i>", "</i><i>")  # Ensure no nested <i>

        return jsonify({"content": response.content, "role": response.role})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == "__main__":
    app.run(debug=True)