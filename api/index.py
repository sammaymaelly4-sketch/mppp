from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .engine import CivicAuditorEngine
import uvicorn

app = FastAPI(title="Civic Auditor Lite API")

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = CivicAuditorEngine()

@app.get("/")
async def root():
    return {"message": "Civic Auditor Lite API is running", "region": "Vale do Paraíba"}

@app.get("/api/cities")
async def get_cities():
    data = engine.generate_regional_data()
    if not data:
        raise HTTPException(status_code=500, detail="Error fetching city data")
    return data

@app.get("/api/city/{slug}")
async def get_city(slug: str):
    data = engine.generate_regional_data()
    city = next((c for c in data if c['slug'] == slug), None)
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    return city

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
