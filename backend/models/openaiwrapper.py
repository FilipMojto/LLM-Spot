from openai import OpenAI, AuthenticationError

try:
	from models.base import LLM, Response
except ImportError:
	from base import LLM, Response


class OpenAIWrapper(LLM):
	MODELS = ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo', 'dall-e-3']

	def __init__(self, api_key: str, verify_key: bool = True):
		super().__init__()

		self.client = OpenAI(api_key=api_key)
		
		
		if verify_key:
			self.is_key_valid(throw_error=True)

		
	def is_key_valid(self, throw_error: bool = True):
		"""_summary_

		Returns:
			_type_: _description_
		"""
		
		try:
			completion = self.client.chat.completions.create(
				model="gpt-3.5-turbo-0125",
				messages=[
					{"role": "system", "content": "This is just a test. Respond 1 if you received this prompt successfully."},
					{
						"role": "user",
						"content": "Sending test request..."
					}
				],
				max_tokens=1
			)

			return completion.choices[0].message.content == "1"
		except AuthenticationError as e:
			if throw_error:
				raise e
			else:
				return False


	def generate_text(self, command: str, model: str, max_tokens: int, temperature: float, context: str = LLM.DEF_CONTEXT):
		"""
		Generates text using OpenAI's GPT models via API call.
		This method sends a request to OpenAI's API to generate text based on the provided command
		and context. It uses the chat completions endpoint which is suitable for conversation-style
		interactions.
		Args:
			command (str): The main prompt/command to send to the model
			model (str): The OpenAI model to use (e.g. "gpt-3.5-turbo", "gpt-4")
			max_tokens (int): Maximum number of tokens to generate in the response
			temperature (float): Controls randomness in the response (0.0-1.0). Higher values mean more random
			context (str, optional): System context to provide to the model. Defaults to LLM.DEF_CONTEXT
		Returns:
			Response: A Response object containing:
				- text_content: The generated text
				- role: The role of the response (usually "assistant")
				- model: The model used for generation
		Raises:
			openai.AuthenticationError: If API key is invalid or missing
			openai.BadRequestError: If request parameters are invalid
			openai.RateLimitError: If you exceed your rate limit
			openai.APIError: If the OpenAI API returns an error
			openai.APIConnectionError: If there's a network error connecting to OpenAI
			openai.APITimeoutError: If the request times out
		"""
		completion = self.client.chat.completions.create(
			model=model,
			messages=[
				{"role": "system", "content": context},
				{
					"role": "user",
					"content": command
				}
			],
			max_tokens=max_tokens,
			temperature=temperature
		)

		return Response(text_content=completion.choices[0].message.content,
				  		role=completion.choices[0].message.role,
						model=model)
	
		

if __name__ == "__main__":
	from dotenv import load_dotenv
	from os import getenv
	from pathlib import Path
	import openai

	# Load .env from parent directory
	env_path = Path(__file__).parent.parent / '.env'
	load_dotenv(dotenv_path=env_path)
	
	try:
		openai_wrapper = OpenAIWrapper(api_key=getenv("OPENAI_API_KEY"))
		# print(openai_wrapper.generate_text(command="Hello, how are you?", model="gpt-3.5-turbo", max_tokens=100000, temperature=0.5))
		# print(openai_wrapper.is_key_valid())
		models = openai.models.list()
		from openai.types import Model
	
		for model in models:
			print(model.__repr__())


	except openai.BadRequestError as e:
		# print(e)
		print(e.message)
		print(e.code)
		print(e.status_code)

