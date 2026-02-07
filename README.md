<!-- <p align="center">
  <img src="https://github.com/user-attachments/assets/26ef9ab2-90b0-4731-9ea5-009db7be80dc" width="115" height="130" style="margin-right: 20px;" />
  <img src="https://github.com/user-attachments/assets/c9c8766d-112d-4c5e-9fed-b39a0ea33e81" width="115" height="130" />
</p> -->

<img width="115" height="130" alt="image" src="https://github.com/user-attachments/assets/26ef9ab2-90b0-4731-9ea5-009db7be80dc" />
<img width="115" height="130" alt="image" src="https://github.com/user-attachments/assets/c9c8766d-112d-4c5e-9fed-b39a0ea33e81" />

**SPARKHACKS 2026**

# PROJECT: THE CUTTING ROOM 
WEEKLY PERSONALIZED PORTFOLIO UPLOAD
```where random moments strike into untold narrative masterpieces ...```

**<u>Track 02:<u> Narrative & Interactive Experience**

A reflective storytelling system that converts weekly user activity into structured narrative insight using embeddings, similarity matching, and generative AI.

# One Sentence Pitch
```The Cutting Room transforms weekly digital activity into a structured narrative using embeddings and generative AI, helping users understand the story hidden inside their everyday behavior.```

# Operation logic
<img width="1560" height="1034" alt="image" src="https://github.com/user-attachments/assets/8e774a1b-c943-4abe-85cb-bf6151e01998" />

<img width="972" height="1096" alt="image" src="https://github.com/user-attachments/assets/5200f60e-5041-4fa0-9a04-5f04cf802e65" />

<details>
<summary><strong>Click to open demo screenshots</strong></summary>

  <details>
    <summary><strong>Login</strong></summary>
    <br>
    <img width="1436" height="954" alt="image" src="https://github.com/user-attachments/assets/08d02b30-79ee-49d1-9ed8-83c9c59b1194" />
    <br>
  </details>
    
  <details>
    <summary><strong>Navigation Bar</strong></summary>
    <br>
    <img width="332" height="582" alt="image" src="https://github.com/user-attachments/assets/efc003b6-14b6-4d6d-8949-106e7e3e7456" />
    <br>
  </details>
    
  <details>
    <summary><strong>Pic Upload Pipeline</strong></summary>
    <br>
    <img width="1840" height="1456" alt="image" src="https://github.com/user-attachments/assets/4bc15185-559e-4ed3-a69e-270403802835" />
    <br>
  </details>
    
  <details>
    <summary><strong>Add Pic & Text Pop up</strong></summary>
    <br>
    <img width="1858" height="1178" alt="image" src="https://github.com/user-attachments/assets/b7207364-fade-4d36-af74-bed9d87e1fb2" />
    <br>
  </details>
    
  <details>
    <summary><strong>Finishing Pipeline - Reflection & Generative Narrative</strong></summary>
    <br>
    <img width="1970" height="1370" alt="image" src="https://github.com/user-attachments/assets/06c58eca-f8b8-459e-ac4d-3d3a25c67693" />
    <br>
  </details>
    
  <details>
    <summary><strong>Top 4 Similar Narratives</strong></summary>
    <br>
    <img width="1574" height="1348" alt="image" src="https://github.com/user-attachments/assets/be56f7cf-465b-4451-98fd-7311759cc646" />
    <br>
  </details>
    
  <details>
    <summary><strong>Friend List</strong></summary>
    <br>
    <img width="1594" height="1352" alt="image" src="https://github.com/user-attachments/assets/2bb3c311-b39a-4fd6-bd26-1a5b1a04af86" />
    <br>
  </details>
    
  <details>
    <summary><strong>Account Owner Profile Layout</strong></summary>
    <br>
    <img width="1204" height="1142" alt="image" src="https://github.com/user-attachments/assets/970aecfc-1eb1-4f72-b057-08929a06cb7f" />
    <br>
  </details>
    
  <details>
    <summary><strong>Friend/Other Users' Profile Layout</strong></summary>
    <br>
    <img width="1618" height="1370" alt="image" src="https://github.com/user-attachments/assets/86b8e892-9dd8-4053-af68-4392cd57c8aa" />
    <br>
  </details>
    
  <details>
    <summary><strong>Track Detailed View Layout</strong></summary>
    <br>
    <img width="1254" height="500" alt="image" src="https://github.com/user-attachments/assets/42941f16-63e0-4104-b025-3b21f0ae8943" />
    <br>
  </details>
  </details>

---

## Team
```
Viet Thai Nguyen - vnguy87@uic.edu
Han Dang - ldang7@uic.edu
Minh Khoa Cao - mcao@uic.edu
Hoang Minh Nguyen - mngu@uic.edu
```
---
## Tech Stack
```
react, express.js, node.js, venv, python, python-package-index, mongodb, figma, canva, aedify.ai
```

## Live Demo Instruction

Deployed on **Aedify.ai**

🔗 [Insert Aedify deployment link here]

To run locally:
```bash
git clone <repo-link>
cd server && npm install && npm run dev
cd ../frontend && npm install && npm run dev
source venv/bin/activate && cd server/services/ml && python3 server.py
```
---

# Problem

Modern social platforms document events but **do not interpret patterns**.

Users post isolated content:
* Photos
* Short text
* Captions

But platforms rarely answer:

* What themes defined your week?
* Did your mood shift?
* How does your experience compare to others?

We wanted to build a system that transforms small moments into structured narrative reflection.

---

# Solution

The Cutting Room introduces **Weekly Tracks**.
Instead of a feed, users build a connected chain of posts called **a track**.

Each post (Node) contains:

* One photo OR one text entry
* Optional caption
* AI-generated one-sentence recap

Users are limited to:
* 3 posts per day
* 20 friends max

This enforces intentional interaction and reduces performance-driven behavior

At **the end of each week**, the system generates:

1. A Personal Story (5–8 sentence behavioral summary)
2. A Community Reflection (comparative trend analysis)

The result is an interactive narrative shaped by user behavior.

---

# Key Features

## 1. Intentional Posting Constraints

* 3 posts per day
* 20 friend limit
* Weekly reset cycle

These constraints improve narrative pacing and reduce content overload.

---

## 2. Node Linking via Embeddings

Each upload generates a semantic embedding:
```
node → embedding → nearest neighbors (kNN)
```

The system links:

* Current node → previous node (personal continuity)
* Current node → semantically similar posts (community parallel)

This creates a structured narrative graph rather than a flat feed.

---

## 3. AI-Generated Recap Per Node

Each node receives a reflective one-sentence recap generated from:

* Node content
* Previous-node similarity distance
* Neighbor context

This creates narrative continuity between moments.

---

## 4. Weekly Narrative Engine

Weekly batch process:
```
1. Collect all nodes in track
2. Order chronologically
3. Cluster embeddings
4. Extract recurring motifs
5. Compare to global embedding clusters
6. Generate:

   Personal story
   Community reflection
```

Narrative is generated from structural patterns — not just summaries.

---

# Technical Implementation

## Frontend

* React (Vite)
* TailwindCSS
* Framer Motion (node linking animation)
* Zustand / Redux Toolkit
* React Query

Responsibilities:

* Upload flow
* Track visualization
* Friend visibility controls
* Story display

---

## Backend

* Node.js
* Express
* Google OAuth 2.0
* REST architecture

Services:

* Node creation
* Track management
* Async AI job scheduling
* Permission management

---

## Database

* MongoDB Atlas

Stores:

* Users
* Nodes (with embedding vectors)
* Tracks (weekly narrative state)

---

## Storage

* AWS S3 or Cloudflare R2 for media
* Database stores URL references + embeddings

---

## AI Model Service (External Worker)

Separate Python FastAPI service handles:

* Embedding generation
* Cosine similarity matching
* kNN neighbor selection
* LLM recap generation
* Weekly narrative generation

Architecture:

```
React Client
   ↓
Express API (Hosted on Aedify.ai)
   ↓
Model Service (Python / FastAPI)
   ↓
MongoDB Update
```

This separation improves modularity and scalability.

---
## Deployment

The backend API is deployed on **Aedify.ai** for scalable hosting and rapid hackathon deployment.

---

# Challenges

1. Balancing AI ambition with hackathon time constraints
2. Ensuring embedding consistency between text and image inputs
3. Designing constraints (3/day, 20 friends) that improved narrative quality
4. Coordinating frontend, backend, and model service asynchronously

We prioritized stable end-to-end functionality over experimental features.

---

# Innovation

Unlike journaling apps or social feeds, our system:

* Uses embeddings to structure narrative relationships
* Generates stories from behavioral patterns
* Connects personal activity with anonymous community parallels
* Applies intentional design constraints to shape user experience

We are not generating stories from single posts.
We are generating stories from structural change over time.

---

# Impact

This project explores:
```
  Reflective digital storytelling
  AI-assisted behavioral insight
  Reduced-performance social interaction
  Intentional posting design
```
Potential use cases:
```
  Student reflection
  Creative journaling
  Mental pattern awareness
  Weekly behavioral insight tracking
```
---

# What We Learned
**Technically**

Narrative can emerge from embedding structure;
Modular AI services improve system reliability.

**Interpersonally**

Through out this experience, each team member took delight in acquiring the ability to adapt and improvise, even in the face of limited resources, limited time constraints in a Hackathon context. We learnt how to collaborate effectively with each other in which each member know how to maximize given time and effectively apply our strengths towards the common final goal.

---

# Future Improvements

* Monthly and semester-level narrative arcs
* Mood trajectory visualization
* More advanced clustering (hierarchical / dynamic K)
* Personalized long-term trend detection

---
