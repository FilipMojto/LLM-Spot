from openai import OpenAI, AuthenticationError

from models.base import LLM, Response


class OpenAIWrapper(LLM):

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

		return Response(content=completion.choices[0].message.content,
				  		role=completion.choices[0].message.role,
						model=model)
	
		