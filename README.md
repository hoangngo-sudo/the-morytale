<img width="115" height="130" alt="image" src="https://github.com/user-attachments/assets/26ef9ab2-90b0-4731-9ea5-009db7be80dc" />
<img width="162" height="130" alt="Image" src="https://github.com/user-attachments/assets/03e2b12c-d610-4cd6-af97-fcda5ef6e35e" />

**SPARKHACKS 2026**

# PROJECT: MORYTALE

*where random moments strike into untold narrative masterpieces...*

**Track 02: Narrative & Interactive Experience**

> Morytale transforms weekly digital moments into a living narrative using generative AI, helping users discover the story hidden inside their everyday life.

---

## Table of Contents

- [Team](#team)
- [Problem](#problem)
- [Solution](#solution)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Demo Screenshots](#demo-screenshots)
- [Challenges](#challenges)
- [Innovation](#innovation)
- [Impact](#impact)
- [What We Learned](#what-we-learned)
- [Future Improvements](#future-improvements)

---

## Team

| Name | Email |
|------|-------|
| Viet Thai Nguyen | vnguy87@uic.edu |
| Han Dang | ldang7@uic.edu |
| Minh Khoa Cao | mcao@uic.edu |
| Hoang Minh Ngo | mngo@uic.edu |

---

## Problem

Modern social platforms document events but **do not interpret patterns**.

Users post isolated content — photos, short text, captions — but platforms rarely answer:

- What themes defined your week?
- Did your mood shift?
- How does your experience compare to others?

We wanted to build a system that transforms small moments into structured narrative reflection.

---

## Solution

Morytale introduces **Weekly Tracks** — instead of a feed, users build a connected chain of posts called **a track**.

Each post (**Node**) contains:
- One photo **or** one text entry
- An optional caption (max 90 characters)
- An AI-generated story segment that weaves the moment into the week's narrative

At **the end of each week**, the system generates:
1. **A Personal Story** — a warm, reflective conclusion to the week
2. **A Community Reflection** — anonymous parallels from other users' weeks

The result is an interactive narrative shaped by real user behavior.

---

## Key Features

### 1. Intentional Posting Design
- 3 posts per day limit
- 20 friend cap
- Weekly reset cycle

These constraints improve narrative pacing and reduce content overload.

### 2. AI Story Weaving
Each upload (image or text) is sent to a **Gemini 2.5 Flash** model that:
- Describes what was shared
- Writes the next 1–2 sentence segment of the user's weekly story
- Maintains narrative continuity with previous moments

### 3. Track Conclusion & Community Reflection
When a user finishes their weekly track, the system:
1. Generates a **conclusion** — a warm wrap-up of the week's story
2. Finds **similar stories** from the community
3. Generates a **community reflection** showing the user they're not alone

### 4. Social Layer
- Google OAuth sign-in
- Friend requests, acceptance, and removal
- Likes on nodes with real-time notifications
- Explore page to discover community tracks
- User profiles with track history

### 5. Notifications
- Like notifications
- Friend request / acceptance alerts
- Polling-based real-time updates

---

## Architecture

```
React Client (Vite)
       ↓
Express API (Node.js, port 5000)
       ↓                ↓
   MongoDB       ML Service (FastAPI, port 8008)
       ↓                ↓
  Cloudflare R2    Google Gemini 2.5 Flash
  (image storage)  (story generation)
```

The Express API handles all orchestration — item storage, node/track management, daily limits, and auto-conclude logic. The Python ML service is a **stateless worker** that only performs AI generation tasks.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| Vite | Build tool & dev server |
| TypeScript | Type safety |
| React Router 7 | Client-side routing |
| Zustand | State management |
| React Query (TanStack) | Server state & caching |
| Bootstrap 5 | Styling |
| Animate.css | Animations |
| Axios | HTTP client |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database & ODM |
| Passport.js | Google OAuth 2.0 authentication |
| JWT | Session tokens |
| Multer | File upload handling |
| Cloudflare R2 (S3-compatible) | Image storage |

### ML Service
| Technology | Purpose |
|------------|---------|
| Python + FastAPI | ML microservice |
| Google Gemini 2.5 Flash | Story generation (text & vision) |
| Pillow | Image processing |
| Uvicorn | ASGI server |

---

## Project Structure

```
morytale/
├── frontend/                   # React client
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── AuthGuard/      # Route protection
│   │   │   ├── DailyUpdateToast/
│   │   │   ├── Header/
│   │   │   ├── Marquee/
│   │   │   ├── SignInModal/
│   │   │   └── UploadModal/
│   │   ├── pages/              # Route pages
│   │   │   ├── LandingPage       # Public landing
│   │   │   ├── StoryPage         # Current week story builder
│   │   │   ├── StoryRecapPage    # Weekly recap view
│   │   │   ├── FinishTrackPage   # Conclude track flow
│   │   │   ├── MyTracksPage      # Track history
│   │   │   ├── MonthlyShowcasePage
│   │   │   ├── ViewTrackPage     # Single track detail
│   │   │   ├── ExplorePage       # Community tracks
│   │   │   ├── ProfilePage       # User profile
│   │   │   └── FriendsPage       # Friend management
│   │   ├── services/api.ts     # Axios API client
│   │   ├── store/              # Zustand stores
│   │   │   ├── authStore.ts
│   │   │   ├── trackStore.ts
│   │   │   ├── socialStore.ts
│   │   │   └── notificationStore.ts
│   │   ├── types/index.ts      # TypeScript interfaces
│   │   └── styles/
│   └── vite.config.ts
├── server/                     # Express API
│   ├── index.js                # Entry point
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── passport.js         # Google OAuth strategy
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT verification
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js
│   │   ├── Item.js             # Content (image/text + embedding)
│   │   ├── Node.js             # Story node in a track
│   │   ├── Track.js            # Weekly track
│   │   └── Notification.js
│   ├── controllers/            # Route handlers
│   ├── routes/                 # Express routes
│   └── services/
│       ├── modelApi.js         # ML service client
│       ├── r2Storage.js        # Cloudflare R2 uploads
│       └── ml/                 # Python ML microservice
│           ├── server.py       # FastAPI app
│           ├── storyGeneration.py
│           ├── trackConclusion.py
│           └── requirements.txt
└── Dockerfile                  # Multi-stage production build
```

---

## API Reference

### Auth (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register with email/password |
| POST | `/login` | Login with email/password |
| GET | `/me` | Get current user (requires auth) |
| GET | `/google` | Initiate Google OAuth |
| GET | `/google/callback` | OAuth callback |

### Items (`/api/items`) — *Auth required*
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create item (image upload or text) |
| GET | `/:id` | Get single item |
| GET | `/user/:userId` | Get user's items |
| PUT | `/:id` | Update item |
| DELETE | `/:id` | Delete item |

### Nodes (`/api/nodes`) — *Auth required*
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create node (triggers AI story generation) |
| GET | `/:id` | Get single node |
| GET | `/user/:userId` | Get user's nodes |
| PUT | `/:id` | Update node |
| DELETE | `/:id` | Delete node |
| POST | `/:id/like` | Like a node |
| DELETE | `/:id/like` | Unlike a node |

### Tracks (`/api/tracks`) — *Auth required*
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/current` | Get current week's track |
| GET | `/history` | Get past tracks |
| GET | `/community` | Get community tracks |
| GET | `/:id` | Get single track |
| GET | `/:id/story` | Get track's compiled story |
| POST | `/:id/conclude` | Conclude track (triggers AI conclusion) |
| PUT | `/:id` | Update track |
| DELETE | `/:id` | Delete track |

### Users (`/api/users`) — *Auth required*
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/me` | Get own profile |
| PUT | `/me` | Update profile |
| GET | `/friends` | Get friend list |
| GET | `/search` | Search user by email |
| GET | `/requests` | Get pending friend requests |
| POST | `/requests/:id/accept` | Accept friend request |
| DELETE | `/requests/:id` | Reject friend request |
| GET | `/:id` | Get user profile |
| POST | `/:id/request` | Send friend request |
| DELETE | `/:id/friend` | Remove friend |

### Notifications (`/api/notifications`) — *Auth required*
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get notifications |
| PUT | `/read-all` | Mark all as read |
| PUT | `/:id/read` | Mark one as read |
| DELETE | `/:id` | Delete notification |

### ML Service (`port 8008`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ml/story-from-image` | Generate story segment from image |
| POST | `/api/ml/story-from-text` | Generate story segment from text |
| POST | `/api/ml/generate-conclusion` | Generate track conclusion + community reflection |
| GET | `/api/ml/health` | Health check |

---

## Getting Started

### Prerequisites
- Node.js 20+
- Python 3.10+
- MongoDB Atlas account (or local MongoDB)
- Cloudflare R2 bucket
- Google Cloud OAuth credentials
- Google Gemini API key

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_GEMINI_API=your_gemini_api_key

R2_ACCOUNT_ID=your_r2_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=morytale
R2_PUBLIC_URL=https://pub-xxx.r2.dev

MODEL_API_URL=http://localhost:8008
```

### Run Locally

**1. Backend (Express API)**
```bash
cd server
npm install
npm run dev
```

**2. Frontend (React + Vite)**
```bash
cd frontend
npm install
npm run dev
```

**3. ML Service (FastAPI)**
```bash
cd server/services/ml
python -m venv venv

# Windows
.\venv\Scripts\Activate.ps1
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python server.py
```

The frontend runs on `http://localhost:5173`, the Express API on `http://localhost:5000`, and the ML service on `http://localhost:8008`.

---

## Deployment

### Docker (Production)

The included multi-stage `Dockerfile` builds the frontend and bundles it with the Express server:

```bash
docker build -t morytale .
docker run -p 5000:5000 --env-file server/.env morytale
```

> **Note:** The ML service runs separately and must be deployed alongside or configured via `MODEL_API_URL`.

---

## Demo Screenshots

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
    <img width="1858" height="1178" alt="image" src="https://github.com/user-attachments/assets/b7207364-fade-4d36-ab74-bed9d87e1fb2" />
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

## Operation Logic

<img width="1560" height="1034" alt="image" src="https://github.com/user-attachments/assets/8e774a1b-c943-4abe-85cb-bf6151e01998" />

<img width="972" height="1096" alt="image" src="https://github.com/user-attachments/assets/5200f60e-5041-4fa0-9a04-5f04cf802e65" />

---

## Challenges

1. Balancing AI ambition with hackathon time constraints
2. Designing a clean separation between the Node.js orchestration layer and the stateless Python ML worker
3. Making Gemini 2.5 Flash produce consistent, well-structured JSON for story segments
4. Coordinating frontend, backend, and ML service across three processes during development
5. Building a social layer (friends, likes, notifications) alongside the core narrative engine

We prioritized stable end-to-end functionality over experimental features.

---

## Innovation

Unlike journaling apps or social feeds, Morytale:

- **Generates stories incrementally** — each upload extends a running narrative, not just a standalone post
- **Uses multimodal AI** — Gemini 2.5 Flash processes both images and text to weave story segments
- **Connects personal experience with community** — anonymous parallel stories show users they're not alone
- **Applies intentional design constraints** — daily limits and friend caps shape meaningful interaction

We are not summarizing posts. We are building narratives from the accumulation of small moments over time.

---

## Impact

This project explores:
- Reflective digital storytelling
- AI-assisted behavioral insight
- Reduced-performance social interaction
- Intentional posting design

Potential use cases:
- Student reflection tools
- Creative journaling platforms
- Mental health pattern awareness
- Weekly behavioral insight tracking

---

## What We Learned

**Technically**

- Narrative can emerge from iterative AI generation over a sequence of user inputs
- Separating ML into a stateless microservice greatly simplifies the main API server
- Zustand + React Query is an effective lightweight state management combo for React 19

**Interpersonally**

Throughout this experience, each team member learned to adapt and improvise under limited time and resources in a hackathon context. We collaborated effectively by maximizing each person's strengths toward our shared goal.

---

## Future Improvements

- Monthly and semester-level narrative arcs
- Mood trajectory visualization
- Embedding-based similarity matching for richer community connections
- More advanced clustering (hierarchical / dynamic K)
- Personalized long-term trend detection

---
