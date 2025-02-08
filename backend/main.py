from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
import random

app = FastAPI()

# Allow CORS for all origins (important if your frontend is deployed on a different domain)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnagramRequest(BaseModel):
    user_name: str
    input_text: str

    # Validate that the name follows the rules:
    # - At least one word.
    # - Maximum of 10 words.
    # - Each word must be at least 3 characters and not exceed 10 characters.
    @validator('user_name')
    def validate_user_name(cls, v):
        words = v.split()
        if not words:
            raise ValueError("Name must contain at least one word.")
        if len(words) > 10:
            raise ValueError("Name cannot contain more than 10 words.")
        for word in words:
            if len(word) < 3:
                raise ValueError("Each word must be at least 3 characters long.")
            if len(word) > 10:
                raise ValueError("Each word must not exceed 10 characters.")
        return v

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/generate-anagram")
def generate_anagram(request: AnagramRequest):
    input_text = request.input_text
    if not input_text.strip():
        raise HTTPException(status_code=400, detail="Input text cannot be empty.")
    
    # Generate sample anagrams by shuffling the input text's characters.
    # We aim to return three distinct anagrams.
    anagrams = set()
    attempts = 0
    while len(anagrams) < 3 and attempts < 20:
        chars = list(input_text)
        random.shuffle(chars)
        candidate = ''.join(chars)
        if candidate != input_text:  # avoid returning the original text
            anagrams.add(candidate)
        attempts += 1

    if not anagrams:
        raise HTTPException(status_code=500, detail="Anagram generation failed.")

    return {"status": "success", "anagrams": list(anagrams)}
