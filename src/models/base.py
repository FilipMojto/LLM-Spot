from dataclasses import dataclass
from abc import ABC, abstractmethod
from datetime import datetime

@dataclass
class Response():
	content: str
	role: str
	model: str
	created_at: datetime = datetime.now()


class LLM(ABC):
	DEF_CONTEXT = ('You are a helpful assistant. Your responses will be processed by a parser, '
					'so do not forget to denote special characters like newline (\n) or tabulator (\t) explicitly! '
					'Please use \\n for newline and \\t for tabulator in your responses, including when generating code.')
	
	@abstractmethod
	def is_key_valid(self, throw_error: bool = True):
		pass

	@abstractmethod
	def generate_text(self, command: str, model: str, context: str = DEF_CONTEXT) -> Response:
		pass