
from llmspot.models.base import LLM, Prompt

class GoogleWrapper(LLM):
	MODELS = []

	def generate_text(self, prompt: Prompt):
		return super().generate_text(prompt=prompt)

	def generate_text_stream(self, prompt: Prompt):
		return super().generate_text_stream(prompt)
	
	def is_key_valid(self, throw_error = True):
		return super().is_key_valid(throw_error)