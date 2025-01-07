# system libraries

# external libraries
import anthropic

# my libraries
from llmspot.models.base import LLM, Prompt


class AnthropicWrapper(LLM):
	MODELS = []
	
	def __init__(self):
		super().__init__()
		# add key here


	def generate_text(self, prompt: Prompt):
		return super().generate_text(prompt=prompt)

	def generate_text_stream(self, prompt: Prompt):
		return super().generate_text_stream(prompt)
	
	def is_key_valid(self, throw_error = True):
		return super().is_key_valid(throw_error)


# if __name__ == "__main__":
# 	a = AnthropicWrapper()
# 	a.client.messages.create(
		
# 	)