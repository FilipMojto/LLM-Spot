from typing import List

from openai import OpenAI, AuthenticationError, models


from llmspot.models.base import LLM, Response, Prompt



class OpenAIWrapper(LLM):
	# MODELS = ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo', 'dall-e-3']


	def __init__(self, api_key: str, verify_key: bool = True):
		super().__init__()
# from openai.types import Model
		self.client = OpenAI(api_key=api_key)
		OpenAIWrapper.MODELS = [model.id for model in self.client.models.list()]
		
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


	def generate_text(self, prompt: Prompt):
		"""
		Generates text using OpenAI's GPT models via API call.

		Args:
			model (str): The OpenAI model to use (e.g. "gpt-3.5-turbo", "gpt-4")
			max_tokens (int): Maximum number of tokens to generate in the response
			command (str): The main instruction/question to send to the model
			randomness (float): Controls variation in responses (0.0-2.0). Higher values mean more random
			word_variety (float): Controls diversity of word choice (0.0-1.0)
			repetitivness (float): Controls repetition penalty (-2.0-2.0)
			output (str, optional): Desired format for the output. Defaults to None
			context (str, optional): System context for the model. Defaults to LLM.DEF_CONTEXT

		Returns:
			Response: Object containing generated text, role, and model used

		Raises:
			Various OpenAI errors for authentication, rate limits, API issues, etc.
		"""
		response = self.client.chat.completions.create(
			model=prompt.model,
			messages=[
				{	"role": "system",
					"content": prompt.context
				},
				{
					"role": "user",
					"content": prompt.instruct + "\n\n" + prompt.output if prompt.output else prompt.instruct
				}
			],
			max_tokens=prompt.max_tokens,
			temperature=prompt.random,
			top_p=prompt.vary_words,
			frequency_penalty=prompt.repeat,
			stream=False
			
		)

		return Response(chunks=[response.choices[0].message.content],
						role=response.choices[0].message.role,
						model=prompt.model)
	
	# def generate_text_stream(self, model: str, max_tokens: int, command: str,
	# 							   randomness: float = 1, word_variety: float = LLM.DEF_WORD_VARIETY,
	# 							   repetitivness: float = LLM.DEF_REPETITIVENESS,
	# 								output: str = None, context: str = LLM.DEF_CONTEXT):
	def generate_text_stream(self, prompt):
		
		"""
		Streams text generation using OpenAI's GPT models via API call.

		Args:
			model (str): The OpenAI model to use (e.g. "gpt-3.5-turbo", "gpt-4") 
			max_tokens (int): Maximum number of tokens to generate
			command (str): The main instruction/question to send to the model
			randomness (float): Controls variation in responses (0.0-2.0)
			word_variety (float): Controls diversity of word choice (0.0-1.0)
			repetitivness (float): Controls repetition penalty (-2.0-2.0)
			output (str, optional): Desired format for the output. Defaults to None
			context (str, optional): System context for the model. Defaults to LLM.DEF_CONTEXT

		Yields:
			Stream of response chunks from the OpenAI API

		Raises:
			Various OpenAI errors for authentication, rate limits, API issues, etc.
		"""
		response_stream = self.client.chat.completions.create(
			model=prompt.model,
			messages=[
				{	"role": "system",
					"content": prompt.context
				},
				{
					"role": "user",
					"content": prompt.instruct + "\n\n" + prompt.output if prompt.output else prompt.instruct
				}
			],
			max_tokens=prompt.max_tokens,
			temperature=prompt.random,
			top_p=prompt.vary_words,
			frequency_penalty=prompt.repeat,
			stream=True
		)

		# for chunk in response_stream:
		# 	choices = 

		chunks: List[str] = []

		for chunk in response_stream:
			chunk_text_content = chunk.choices[0].delta.content

			# content can be null
			if chunk_text_content:
				chunks.append(chunk_text_content)
				# text_content += chunk_text_content
				yield chunk_text_content

		yield Response(chunks=chunks,
				  role="assistant",
				  model=prompt.model)


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
		
		for model in models:
			print(model)

		# for chunk in openai_wrapper.generate_text_stream(Prompt(model="gpt-4o-mini", max_tokens=100, random=0.5, instruct="Explain how nerual networks work.")):
		# 	print(chunk)
		# 	# print(chunk.choices[0].delta.content)
		# 	print("****************")

		# response = openai_wrapper.client.chat.completions.create(
		# 	messages=[
		# 		{
		# 			"role": "user",
		# 			"content": "Explain how nerual networks work.",
		# 		}
		# 	],
		# 	model="gpt-4o-mini",
		# 	stream=True
		# )

		# for chunk in response:
		# 	# print(chunk)
		# 	print(chunk.choices[0].delta.content)
		# 	print("****************")
		# from openai.types import Model
	
		# for model in models:
		# 	print(model.__repr__())


	except openai.BadRequestError as e:
		# print(e)
		# print(e.message)
		# print(e.code)
		# print(e.status_code)
		raise e


