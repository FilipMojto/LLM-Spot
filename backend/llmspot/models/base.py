from dataclasses import dataclass, field
from abc import ABC, abstractmethod
from datetime import datetime
from typing import List
from pydantic import BaseModel, Field

from llmspot.models.constants import *


class Message(BaseModel):
    model: str
    role: str
    created_at: datetime = Field(default_factory=datetime.now, init=False)
    updated_at: datetime = Field(default_factory=datetime.now, init=False)

    def __setattr__(self, name, value):
        super().__setattr__(name, value)
        if name != 'updated_at':
            super().__setattr__('updated_at', datetime.now())

    def to_dict(self) -> dict:
        """
        Converts the instance to a dictionary.
        """
        return self.model_dump()

class Response(Message):
    chunks: List[str] = Field(default_factory=list)

    def to_dict(self) -> dict:
        """
        Converts the instance to a dictionary, including additional fields.
        """
        data = super().to_dict()
        data["chunks"] = self.chunks
        return data


class Prompt(Message):
    instruct: str
    max_tokens: int
    output: str = Field(default=None)
    context: str = Field(default="Default Context")
    random: float = Field(default=0.7)
    vary_words: float = Field(default=1.0)
    repeat: float = Field(default=0.0)

    def to_dict(self) -> dict:
        """
        Converts the instance to a dictionary, including additional fields.
        """
        data = super().to_dict()
        data.update({
            "instruct": self.instruct,
            "max_tokens": self.max_tokens,
            "output": self.output,
            "context": self.context,
            "random": self.random,
            "vary_words": self.vary_words,
            "repeat": self.repeat
        })
        return data

class LLM:
     ...

class LLM(ABC):
    @classmethod
    def get_services(cls):
        return [class_.__name__ for class_ in cls.__subclasses__()]
    
    MODELS = []
    
    @abstractmethod
    def is_key_valid(self, throw_error: bool = True):
        pass
    
    @abstractmethod
    def generate_text(self, prompt: Prompt):
        ...

    @abstractmethod
    def generate_text_stream(self, prompt: Prompt):
        ...
    
    # @abstractmethod
    # def generate_text(self, model: str, max_tokens: int, command: str,
    # 							   randomness: float = 1, word_variety: float = DEF_WORD_VARIETY,
    # 							   repetitivness: float = DEF_REPETITIVENESS,
    # 								output: str = None, context: str = DEF_CONTEXT):
    # 	...

    # @abstractmethod
    # def generate_text_stream(self, model: str, max_tokens: int, command: str,
    # 							   randomness: float = 1, word_variety: float = DEF_WORD_VARIETY,
    # 							   repetitivness: float = DEF_REPETITIVENESS,
    # 								output: str = None, context: str = DEF_CONTEXT):
    # 	...