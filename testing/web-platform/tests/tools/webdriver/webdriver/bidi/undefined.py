import enum
from enum import Enum
from typing import TypeVar, Union


class Undefined(Enum):
    """
    Class representing special value that indicates that a property is not set.
    """

    UNDEFINED = enum.auto()


UNDEFINED = Undefined.UNDEFINED
"""A special value that indicates that a property is not set."""

T = TypeVar("T")



Maybe = Union[T, Undefined]



Nullable = Union[T, None]
