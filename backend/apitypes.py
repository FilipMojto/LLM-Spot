from pydantic import BaseModel, Field
from typing import List
from datetime import datetime
import uuid

class Message(BaseModel):
	text: str
	role: str
	created_at: datetime = Field(default_factory=datetime.now)
	updated_at: datetime = Field(default_factory=datetime.now)
	
	def __setattr__(self, name, value):
		super().__setattr__(name, value)
		if name != 'updated_at':
			super().__setattr__('updated_at', datetime.now())

	def to_dict(self):
		return {
			'text': self.text,
			'role': self.role,
			'created_at': self.created_at.isoformat(),
			'updated_at': self.updated_at.isoformat()
		}
	

class Conversation(BaseModel):
	id: uuid.UUID = Field(default_factory=uuid.uuid4)
	title: str
	messages: List[Message] = Field(default_factory=list)
	created_at: datetime = Field(default_factory=datetime.now)
	updated_at: datetime = Field(default_factory=datetime.now)

	def __setattr__(self, name, value):
		super().__setattr__(name, value)
		if name != 'updated_at':
			super().__setattr__('updated_at', datetime.now())

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