# THE CUTTING ROOM
## A communal wall of rejected work where the wall itself becomes the narrator

---

## Core Idea

The Cutting Room is an interactive storytelling application where users upload abandoned photos and unfinished text. Instead of highlighting individual posts, the system analyzes the *collection as a whole* and produces a narrative describing what the community is collectively revealing.

The narrative is not about any one person.

The narrative is about the wall.

As fragments accumulate, the wall develops a voice, a mood, and eventually a character. Users are not reading a story — they are inside a system that gradually tells a story about them.

Early:
“These fragments avoid faces.”

Later:
“This wall keeps cutting away when things get personal.”

Later:
“No one here wants to be seen.”

The story emerges from behavioral patterns.

---

## User Experience

Users can:
- upload an abandoned photo
- upload unfinished text
- optionally add a one-sentence “why I cut this”
- anonymously contribute to the wall
- later claim a fragment on their personal profile

The system:
1. extracts semantic meaning
2. groups fragments
3. analyzes behavioral patterns
4. generates evolving narrative
5. assigns a music mood

The wall updates over time, so the story unfolds across days rather than instantly.

---

## Social Structure

### Community Focus
- Each user can follow up to 40 friends
- Small social circles encourage honesty
- Prevents influencer dynamics

### Dual Identity System

Community Wall
- anonymous contribution
- feeds narrative engine

Personal Studio
- claimed fragments
- comments and discussion
- visible identity

Users can first post safely, then reveal authorship later.

### Engagement Features
- likes
- comments
- following
- notifications

Engagement exists, but the primary object is the *wall*, not the profile.

---

## System Overview

Fragments
   ↓
Embeddings
   ↓
Dynamic Clustering
   ↓
Cluster Feature Extraction
   ↓
Cluster Relationship Graph
   ↓
Narrative State Engine
   ↓
LLM Story Generation
   ↓
Wall Narrative + Music Mood

---

## Technical Stack

Frontend
- React (MERN)
- Bootstrap
- Masonry / grid layout library

Backend
- Node.js + Express API

Database
- MongoDB Atlas

Image Storage
- Cloudflare R2

Deployment
- aedify.ai

ML Services
- Embedding API
- LLM API

---

## AI Pipeline

We orchestrate existing models rather than training our own.

---

### Step 1 — Upload

User uploads:
- photo OR text

Images stored in Cloudflare R2  
Metadata stored in MongoDB

---

### Step 2 — Embedding Extraction

Each fragment is converted into a semantic vector.

Text:
embedding(text)

Image:
caption(image) → embedding(caption)

The embedding represents meaning rather than pixels.

Stored in MongoDB:
fragment.embedding = [vector]

---

### Step 3 — Dynamic Clustering

Instead of fixed groups, clusters adapt over time.

Process:
1. fetch all embeddings
2. normalize vectors
3. run clustering algorithm

Options:
- KMeans with adaptive K (silhouette scoring)
OR
- Agglomerative clustering (preferred hackathon solution)

Output:
Cluster IDs assigned to fragments.

Clusters update periodically (ex: every 20 uploads).

---

### Step 4 — Cluster Feature Extraction

Each cluster becomes a behavioral object.

We compute:

size
growth rate
variance
average brightness (images)
face ratio (optional)
abandonment stage metadata
time-of-day upload pattern

Example:

Cluster C1:
{
  size: 27,
  brightness_avg: low,
  face_ratio: 0.08,
  growth_delta: +9,
  variance: 0.15
}

Now clusters have traits, not just similarity.

---

### Step 5 — Cluster Relationship Graph

We compare cluster centroids.

edge_weight = cosine_similarity(Ci, Cj)

This allows detection of:
- clusters merging
- clusters separating
- dominant clusters
- emerging clusters

We also track:
- shared users
- temporal growth

No heavy graph ML required — simple math.

---

### Step 6 — Narrative State Engine

This is the core storytelling logic.

We do NOT generate text directly from fragments.

We generate a structured narrative state.

NarrativeState {
    dominant_cluster
    emerging_cluster
    suppressed_cluster
    tension_score
    theme_label
}

Example rules:

If a cluster > 40% of fragments:
→ dominant cluster

If cluster growth rapidly increases:
→ emerging cluster

If dominant cluster has low face visibility:
→ theme = avoidance

If two clusters move closer:
→ state = convergence

This produces an interpretable behavioral summary.

---

### Step 7 — Story Generation (LLM)

We feed the narrative state to an LLM.

Prompt structure:

You are the voice of a wall observing collective behavior.
Write 2–3 sentences describing what the wall is becoming.
Be reflective, not certain.
No advice, no positivity bias.

Input:

Dominant cluster:
- dark images
- no faces
- rapidly growing

Emerging cluster:
- bright outdoor scenes

State: converging

Output:

“The wall is split between retreat and exposure.
What avoids faces now sits beside open air.
Something here is deciding whether to hide or be seen.”

---

### Step 8 — Music Mood Assignment

Based on theme_label we assign a mood:

avoidance → ambient piano  
nostalgia → tape hiss / lo-fi  
exposure → outdoor ambience

Optional:
Attach a random track from a predefined library.

---

## Database Schema

Users
_id
username
email
password_hash
followers[]
following[]
claimed_fragments[]

Fragments
_id
type (image | text)
content_url or text_body
embedding[]
cluster_id
author_id (nullable)
claimed (bool)
created_at
cut_reason (optional)

Clusters
_id
centroid[]
size
growth_rate
variance
theme_label
wall_note
music_mood
updated_at

NarrativeStates
_id
dominant_cluster
emerging_cluster
tension_score
theme_label
generated_story
timestamp

Comments
_id
user_id
fragment_id OR cluster_id
text
created_at

Likes
_id
user_id
target_id
target_type (fragment | cluster)

---

## Claiming Mechanic

A user can later claim a fragment they uploaded anonymously.

Effects:
- attaches fragment to profile
- unlocks discussion
- increases engagement

This encourages honest posting while preserving community interaction.

---

## Visual Design

Light theme only.

The app should feel:
not high-tech
not futuristic
not corporate

Design language:
- corkboard aesthetic
- pinned cards
- soft beige backgrounds
- imperfect borders
- handwritten accents

Goal: a studio wall, not a platform.

---

## Demo Flow (For Judges)

1. Show empty wall
2. Upload fragments
3. Show clustering
4. Trigger narrative update
5. Reveal wall voice
6. Play music mood
7. Claim a fragment
8. Show profile

The emotional moment is when the wall speaks.

---

## Why This Is Interactive Storytelling

We are not generating stories from images.

We are generating stories from **structural shifts in collective behavior**.

Users influence the narrative unintentionally. The wall reacts to patterns rather than individual actions.

The wall becomes a character.

---

## One Sentence Pitch

The Cutting Room is a communal wall of discarded work where an AI observes patterns in what people abandon and slowly develops a narrative voice describing what the community is afraid to show.