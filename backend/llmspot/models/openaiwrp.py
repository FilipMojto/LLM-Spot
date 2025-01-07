from typing import List

from openai import OpenAI, AuthenticationError, models


from llmspot.models.base import LLM, Response, Prompt



class OpenAIWrapper(LLM):
	MODELS = ["gpt-4-turbo",
    "gpt-4-1106-preview",
    "gpt-3.5-turbo",
    "gpt-3.5-turbo-0125",
    "gpt-3.5-turbo-instruct",
    "gpt-3.5-turbo-16k",
    "gpt-4-0125-preview",
    "gpt-4-turbo-preview",
    "chatgpt-4o-latest",
    "gpt-3.5-turbo-1106",
    "gpt-3.5-turbo-instruct-0914",
    "gpt-4",
    "gpt-4-0613",
    "gpt-4-turbo-2024-04-09"]


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