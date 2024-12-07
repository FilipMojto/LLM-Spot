import os

from dotenv import load_dotenv

from models.base import Response
from models.openaiwrapper import OpenAIWrapper
# from models.openaiwrapper import OpenAIWrapper

load_dotenv()

openai_wrapper = OpenAIWrapper(api_key=os.getenv("OPEN_API_KEY"), verify_key=False)
response = openai_wrapper.generate_text(command="Tell me a funny joke :D", model="gpt-3.5-turbo")

print(response)



