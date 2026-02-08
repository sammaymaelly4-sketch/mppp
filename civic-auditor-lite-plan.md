# Civic Auditor Lite - Implementation Plan (Python + Vanilla)

## 1. Vision & Architecture

A high-performance, single-page application version of the Civic Auditor, optimized for speed and fluidity.

- **Backend**: FastAPI (Python) - Handling API proxying, data ingestion, and score calculation.
- **Frontend**: Vanilla HTML5, CSS3, and JavaScript (ES6+).
- **Design Mode**: "High-Tech Technical Audit" (Sharp edges, high contrast, performance-obsessed).

## 2. Tech Stack

- **Python 3.10+**: Core logic.
- **FastAPI**: Lightweight web framework.
- **Uvicorn**: ASGI server.
- **Vanilla CSS**: Performance-first styling (no frameworks).
- **Vanilla JS**: Component-less, fast interactivity.

## 3. Project Structure

```text
civic-auditor-lite/
├── backend/
│   ├── main.py          # FastAPI server
│   ├── engine.py        # Compliance scoring engine
│   └── data/            # Static datasets
├── frontend/
│   ├── index.html       # Main entry point
│   ├── css/
│   │   └── style.css    # Core design system
│   └── js/
│       ├── app.js       # App logic
│       └── utils.js     # Helpers
├── scripts/             # Internal maintenance
└── requirements.txt     # Python deps
```

## 4. Phase 1: Backend Foundation ⚙️

- Setup FastAPI with CORS for local development.
- Port `CivicAuditorEngine` from the main project to `backend/engine.py`.
- Create `/api/cities` endpoint to return the Vale do Paraíba data.
- Create `/api/city/{slug}` for detailed scores.

## 5. Phase 2: Frontend Design "Performance-First" 🎨

- **Style**: Technical/Brutalist. 0px-2px rounded corners, mono-fonts for data, high-contrast signals (Green/Red/Amber).
- **Layout**: Fluid dashboard that adapts perfectly.
- **Timing**: Implement `requestAnimationFrame` for smooth transitions and a "Loading Stagger" effect for city list.

## 6. Phase 3: Integration & Fluidity 🚀

- Fetch data from Python backend using `fetch()`.
- Implement a "Live Search" with optimized debouncing.
- Interactive Map using Leaflet (loaded via CDN for speed).

## 7. Next Immediate Steps

1. Initialize Python environment and install dependencies (`fastapi`, `uvicorn`, `requests`).
2. Create `backend/main.py` and `backend/engine.py`.
3. Scaffold `frontend/index.html`.
