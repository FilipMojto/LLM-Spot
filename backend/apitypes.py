from pydantic import BaseModel, Field, model_validator
from typing import List
from datetime import datetime
import uuid

from llmspot.models.base import Message


class Conversation(BaseModel):
	id: uuid.UUID = Field(default_factory=uuid.uuid4)
	title: str = Field(min_length=1, max_length=10)
	messages: List[Message] = Field(default_factory=list)
	created_at: datetime = Field(default_factory=datetime.now, init=False)
	updated_at: datetime = Field(default_factory=datetime.now, init=False)





	def to_dict(self):
		return {
			'id': str(self.id),
			'title': self.title,
			'messages': [msg.to_dict() for msg in self.messages],
			'created_at': self.created_at.isoformat(),
			'updated_at': self.updated_at.isoformat()
		}



if __name__ == "__main__":
	import time
	a = Conversation(title="Test")
	time.sleep(1)

	b = Conversation(title="Test2")
	assert(a.id != b.id)

	assert(a.created_at != b.created_at)
	print(a.created_at)
	print(b.created_at)
	# print(a.to_dict())
	# print(b.to_dict())