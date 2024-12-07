import os

from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template
from models.openaiwrapper import OpenAIWrapper

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
    context = data.get("context", "Your default context here.")

    try:
        response = openai_wrapper.generate_text(prompt, model, context)
        return jsonify({"content": response.content, "role": response.role})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)