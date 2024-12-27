import requests
import json

url = "http://127.0.0.1:5000/generate"

payload = {
    "prompt": "Tell me a joke.",
    "model": "gpt-3.5-turbo",
    "temperature": 0.7,
    "maxTokens": 50
}

headers = {
    "Content-Type": "application/json"
}

response = requests.post(url, headers=headers, data=json.dumps(payload))

if response.status_code == 200:
    print("Response:", response.json())
else:
    print("Failed with status code:", response.	)
    print("Error:", response.text)