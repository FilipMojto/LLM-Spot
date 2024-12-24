from dataclasses import dataclass, field
from abc import ABC, abstractmethod
from datetime import datetime

@dataclass
class Response:
    text_content: str
    role: str
    model: str
    created_at: datetime = field(default_factory=datetime.now)


class LLM(ABC):
	DEF_CONTEXT = ('You are a helpful assistant. Your responses will be processed by a parser. ')
	
	@abstractmethod
	def is_key_valid(self, throw_error: bool = True):
		pass

	@abstractmethod
	def generate_text(self, command: str, model: str, context: str = DEF_CONTEXT) -> Response:
		pass