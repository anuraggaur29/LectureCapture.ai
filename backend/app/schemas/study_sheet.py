from pydantic import BaseModel, Field
from typing import List, Optional

class KeyConcept(BaseModel):
    concept: str = Field(description="Name or title of the concept")
    description: str = Field(description="Clear, concise explanation of the concept")

class Definition(BaseModel):
    term: str = Field(description="Academic or technical term")
    definition: str = Field(description="Precise definition of the term")

class Formula(BaseModel):
    name: str = Field(description="Formula or equation identifier/name")
    expression: str = Field(description="Mathematical expression or syntax format")
    context: str = Field(description="When or how to apply this formula")

class StudySheetResponse(BaseModel):
    title: str = Field(description="Concise, descriptive title for the lecture/document")
    subject: str = Field(description="Academic subject or domain (e.g., Computer Science, Physics)")
    learning_objectives: List[str] = Field(description="3-5 clear bullet points stating what the student will master")
    key_concepts: List[KeyConcept] = Field(description="Core concepts covered in the material")
    definitions: List[Definition] = Field(description="Key technical terms and definitions")
    formulae: Optional[List[Formula]] = Field(default=[], description="Formulas, equations, or formal syntax rules mentioned")
    examples: List[str] = Field(description="Concrete examples or scenarios discussed")
    common_mistakes: List[str] = Field(description="Frequent misconceptions, errors, or exam traps to avoid")
    revision_notes: List[str] = Field(description="High-yield bullet points for quick last-minute review")
    final_summary: str = Field(description="A 2-3 sentence overarching wrap-up summary")
