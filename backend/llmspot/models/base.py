from abc import ABC, abstractmethod
from datetime import datetime
from typing import List, ClassVar
from typing_extensions import Self
from pydantic import BaseModel, Field, model_validator
import logging


from llmspot.models.constants import *

logger = logging.getLogger(__name__)

class BadPromptError(Exception):
    def __init__(self, *args):
        super().__init__(*args)


class Message(BaseModel):
    model: str
    role: str
    created_at: datetime = Field(default_factory=datetime.now, init=False)
    updated_at: datetime = Field(default_factory=datetime.now, init=False)

    class Config:
        validate_assignment = True


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
    context: str = Field(default=DEF_CONTEXT)
    random: float = Field(default=DEF_RANDOMNESS)
    vary_words: float = Field(default=DEF_WORD_VARIETY)
    repeat: float = Field(default=DEF_REPETITIVENESS)
    
    @model_validator(mode='after')
    def validate_fields(self) -> Self:
        if not MIN_RANDOMNESS <= self.random <= MAX_RANDOMNESS:
            raise BadPromptError(f"'random' must be between {MIN_RANDOMNESS} and {MAX_RANDOMNESS}.")
        
        if not MIN_WORD_VARIETY <= self.vary_words <= MAX_WORD_VARIETY:
            raise BadPromptError(f"'vary_words' must be between {MIN_WORD_VARIETY} and {MAX_WORD_VARIETY}.")
        
        if not MIN_REPETITIVENESS <= self.repeat <= MAX_REPETITIVENESS:
            raise BadPromptError(f"'repeat' must be between {MIN_REPETITIVENESS} and {MAX_REPETITIVENESS}.")
        
        return self
    

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
    
class OpenAIPrompt(Prompt):
    
    MAX_OUTPUT_TOKENS: ClassVar[int] = 4096

    @model_validator(mode='after')

    def validate_fields(self) -> Self:
        if self.max_tokens > OpenAIPrompt.MAX_OUTPUT_TOKENS:
            raise BadPromptError(f"Maximum amount of output tokens {OpenAIPrompt.MAX_OUTPUT_TOKENS} exceeded.")
        
        return self


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