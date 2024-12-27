
from models.base import LLM

class GoogleWrapper(LLM):
	MODELS = []

	def generate_text(self, command, model, context = ...):
		return super().generate_text(command, model, context)
	
	def is_key_valid(self, throw_error = True):
		return super().is_key_valid(throw_error)