# main.py
import os
import json
import re
from typing import Optional
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Google generative ai SDK
import google.generativeai as genai

load_dotenv()

GOOGLE_API_KEY = os.getenv("AIzaSyBoC4PdP_nNb3Vf6y3khN30h7IK3jdQ5iU")
if not GOOGLE_API_KEY:
    print("Warning: GOOGLE_API_KEY not set — endpoint will return a sample design for local testing.")
else:
    genai.configure(api_key=GOOGLE_API_KEY)

app = FastAPI()

# Allow requests from frontend; if serving both from same origin you can tighten this
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve index.html from same folder (so relative fetch('/api/...') works)
@app.get("/")
async def root():
    return FileResponse("index.html")

class PromptIn(BaseModel):
    prompt: str

def build_prompt(user_prompt: str) -> str:
    instruction = """
You are an assistant that outputs a system design as JSON ONLY. Do NOT include extra explanation.
Return a JSON object with:
{
  "nodes": {
     "<node_id>": {
        "name": "<display name>",
        "tech": "<comma separated tech/tags>",
        "description": "<short description>",
        "x": 120,
        "y": 200
     },
     ...
  },
  "connections": [
     "node1->node2",
     {"from":"nodeA","to":"nodeB"},
     ...
  ]
}
Make node ids short, lowercased, no spaces (e.g., "auth", "api", "db").
"""
    return instruction + "\n\nUser request:\n" + user_prompt

@app.post("/api/generate_design")
async def generate_design(inp: PromptIn):
    prompt = build_prompt(inp.prompt)

    # Fallback: if no API key configured, return a sample design
    if not GOOGLE_API_KEY:
        sample = {
            "nodes": {
                "frontend": {"name":"Frontend","tech":"React","description":"Client-side UI"},
                "api": {"name":"API Gateway","tech":"FastAPI,Nginx","description":"External API endpoints"},
                "auth": {"name":"Auth Service","tech":"OAuth2,JWT","description":"Authentication & tokens"},
                "db": {"name":"Primary DB","tech":"Postgres","description":"Relational storage"},
                "cache": {"name":"Cache","tech":"Redis","description":"Caching layer for performance"}
            },
            "connections": ["frontend->api","api->auth","api->db","api->cache"]
        }
        return JSONResponse(content={"text": json.dumps(sample), "design": sample})

    # Real call using google.generativeai
    try:
        # Using chat completions is often better for instruction-following
        # Model names can differ: use "chat-bison-001" or appropriate model name in your account.
        response = genai.chat.completions.create(
            model="chat-bison-001",
            messages=[
                {"author":"system", "content": "You are a helpful assistant that outputs only JSON describing system architecture nodes and connections."},
                {"author":"user", "content": prompt}
            ],
            temperature=0.1,
            max_output_tokens=800
        )
        # The exact field containing generated text may vary; check response structure.
        # Typically: response.choices[0].message.content
        gen_text = None
        try:
            gen_text = response.choices[0].message.content
        except Exception:
            # fallback to raw .text if available
            gen_text = getattr(response, "text", None) or str(response)

        # Try to parse JSON from the model output
        try:
            design = json.loads(gen_text)
        except Exception:
            # attempt to extract the first JSON object in the text
            m = re.search(r'(\{(?:.|\s)*\})', gen_text)
            design = json.loads(m.group(1)) if m else None

        return JSONResponse(content={"text": gen_text, "design": design})
    except Exception as e:
        # Return an error structure so frontend can show it nicely
        return JSONResponse(status_code=500, content={"error":"LLM request failed","detail": str(e)})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
