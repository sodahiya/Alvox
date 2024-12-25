from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import edge_tts
import asyncio
import base64
import io

app = FastAPI()

# Enable CORS with more permissive settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Default voice
VOICE = "en-US-ChristopherNeural"

class TextRequest(BaseModel):
    text: str
    voice: str = VOICE

@app.get("/voices")  # Changed to GET request
async def list_voices():
    try:
        voices = await edge_tts.list_voices()
        return {"voices": voices}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/synthesize")
async def synthesize_speech(request: TextRequest):
    try:
        # Preprocess text
        text = request.text.strip()
        if not text:
            raise HTTPException(status_code=400, detail="Text cannot be empty")

        # Create communicate object
        communicate = edge_tts.Communicate(text, request.voice)
        
        # Create an in-memory bytes buffer
        audio_buffer = io.BytesIO()

        # Generate speech
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_buffer.write(chunk["data"])

        # Get the audio data and convert to base64
        audio_buffer.seek(0)
        audio_base64 = base64.b64encode(audio_buffer.read()).decode()

        return {"audio": audio_base64}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
