import google.genai as genai
from pathlib import Path
from dotenv import load_dotenv
import os

# Load .env from server directory
load_dotenv(Path(__file__).resolve().parent.parent.parent / '.env')

client = genai.Client(api_key=os.environ.get("GOOGLE_GEMINI_API"))


conclusion_prompt = """
You are helping wrap up someone's weekly story.
They've been sharing moments throughout the week, and now it's time to bring it all together with a nice ending.

Write 2-3 sentences (keep it under 80 words) that:
- Give the week a warm, thoughtful ending
- Point out any patterns or little bits of growth you noticed
- Feel like the closing lines of a short personal journal entry

A few rules:
- Don't use any technical words like "users", "items", or "database"
- Write about them in third person (he/she/they)
- Keep it down-to-earth and honest
"""

community_prompt = """
You are writing a short, friendly note to let someone know that other people have had similar weeks.
You have:
1. This person's finished weekly story
2. Short summaries of similar stories from other people (kept anonymous)

Write 2-3 sentences (keep it under 80 words) that:
- Show them they're not alone in what they experienced
- Mention the things they have in common with others, without giving away who anyone is
- Leave them feeling connected and a little uplifted

A few rules:
- Don't use technical words like "users", "items", or "database"
- Don't name or identify anyone
- Talk directly to them using "you"
- Keep it warm and encouraging
"""


def generate_conclusion(story):
    """
    Generate a concluding paragraph for the week's story.

    Args:
        story: The full story built up during the week

    Returns:
        A conclusion string (2-3 sentences)
    """
    prompt = f"""{conclusion_prompt}

---
Weekly story:
{story}

---
Write the conclusion:
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text.strip()


def generate_community_reflection(story, similar_stories):
    """
    Generate a community reflection showing the user they're not alone.

    Args:
        story: The user's completed weekly story
        similar_stories: List of anonymized stories from other users

    Returns:
        A community reflection string (2-3 sentences)
    """
    similar_text = "\n\n".join(
        [f"Anonymous story {i+1}:\n{s}" for i, s in enumerate(similar_stories) if s]
    )

    prompt = f"""{community_prompt}

---
Your weekly story:
{story}

Similar stories from the community:
{similar_text if similar_text else "(No similar stories found this week.)"}

---
Write the community reflection:
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text.strip()
