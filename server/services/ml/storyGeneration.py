import google.genai as genai
import google.genai.types as types
from pathlib import Path
from dotenv import load_dotenv
import os

# Load .env from server directory
load_dotenv(Path(__file__).resolve().parent.parent.parent / '.env')

client = genai.Client(api_key=os.environ.get("GOOGLE_GEMINI_API"))

STORY_PROMPT_TEMPLATE = """
You are a friendly storyteller helping someone tell the story of their week, one moment at a time.
Your job is to keep the story going in a way that feels real and personal, like a diary entry written by a good friend.

Here is the story so far:
{story_so_far}

Here is the new moment they just shared:
{user_input}

What to do:
1. Look at what they shared:
   - If it's a photo, describe what you see and how it feels.
   - If it's text, pick up on what they're thinking or what happened.
2. Write the next part of their story:
   - Keep it short — just 1 or 2 sentences (about 30-50 words).
   - Make it feel natural, like you're painting a little picture with words.
   - Connect what's happening on the outside to how they might be feeling inside.

Give your answer as JSON like this:
{{
  "description": "A simple description of what was shared (like 'A photo of a rainy window' or 'A note about feeling lost')",
  "story_segment": "The next part of the story goes here."
}}
"""

def generate_story_from_text(text_content, story_so_far=""):
    """
    Generate a story segment from text input.
    """
    prompt = STORY_PROMPT_TEMPLATE.format(
        story_so_far=story_so_far if story_so_far else "(This is the beginning of the story.)",
        user_input=f"Text Note: \"{text_content}\""
    )

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json"
        )
    )
    
    # Simple parsing since we requested JSON
    import json
    try:
        return json.loads(response.text)
    except Exception as e:
        print(f"JSON parsing failed: {e}. Raw: {response.text}")
        # Fallback
        return {
            "description": "A text note.",
            "story_segment": text_content
        }

def generate_story_from_image(image_bytes, mime_type, story_so_far=""):
    """
    Generate a story segment from an image.
    """
    prompt = STORY_PROMPT_TEMPLATE.format(
        story_so_far=story_so_far if story_so_far else "(This is the beginning of the story.)",
        user_input="(Analyzed from the attached image)"
    )

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            types.Part.from_bytes(
                data=image_bytes,
                mime_type=mime_type,
            ),
            prompt
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json"
        )
    )

    import json
    try:
        return json.loads(response.text)
    except Exception as e:
        print(f"JSON parsing failed: {e}. Raw: {response.text}")
        return {
            "description": "An uploaded image.",
            "story_segment": "A new moment was captured, but the words escape me."
        }