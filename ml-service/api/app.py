from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
from contextlib import asynccontextmanager
import joblib
import numpy as np
import os

artifacts = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    base = os.path.join(os.path.dirname(__file__), "..", "model", "artifacts")
    try:
        artifacts["model"]         = joblib.load(os.path.join(base, "model.pkl"))
        artifacts["scaler"]        = joblib.load(os.path.join(base, "scaler.pkl"))
        artifacts["label_encoder"] = joblib.load(os.path.join(base, "label_encoder.pkl"))
        artifacts["feature_names"] = joblib.load(os.path.join(base, "feature_names.pkl"))
        artifacts["column_encoders"] = joblib.load(os.path.join(base, "column_encoders.pkl"))
        print(f"Model loaded — {len(artifacts['label_encoder'].classes_)} career classes ready")
    except FileNotFoundError as e:
        print(f"Artifact not found: {e}")
        raise RuntimeError("Run the training notebook before starting the API")
    yield
    artifacts.clear()

app = FastAPI(
    title="Career Recommendation ML API",
    description="Predicts the most suitable career based on user profile",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProfileInput(BaseModel):
    gender: str
    ug_course: str
    ug_specialization: str
    interests: str
    skills: str
    cgpa: float
    has_certification: str
    certification_title: str
    is_working: str
    masters_field: str

    @validator("cgpa")
    def cgpa_range(cls, v):
        if not (0.0 <= v <= 10.0):
            raise ValueError("CGPA must be between 0 and 10")
        return v

class CareerResult(BaseModel):
    career: str
    confidence: float
    top_5: list[dict]

def encode_input(profile: ProfileInput) -> np.ndarray:
    feature_names    = artifacts["feature_names"]
    column_encoders  = artifacts["column_encoders"]

    raw = {
        "gender":              profile.gender,
        "ug_course":           profile.ug_course,
        "ug_specialization":   profile.ug_specialization,
        "interests":           profile.interests,
        "skills":              profile.skills,
        "cgpa":                profile.cgpa,
        "has_certification":   profile.has_certification,
        "certification_title": profile.certification_title,
        "is_working":          profile.is_working,
        "masters_field":       profile.masters_field,
    }

    row = []
    for feat in feature_names:
        val = raw.get(feat, "")
        if feat in column_encoders:
            enc = column_encoders[feat]
            str_val = str(val)
            if str_val in enc.classes_:
                encoded = enc.transform([str_val])[0]
            else:
                encoded = 0
            row.append(encoded)
        else:
            row.append(float(val))

    return np.array([row])

@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": "model" in artifacts,
        "classes": len(artifacts["label_encoder"].classes_) if "label_encoder" in artifacts else 0
    }

@app.get("/careers")
def list_careers():
    if "label_encoder" not in artifacts:
        raise HTTPException(status_code=503, detail="Model not loaded")
    return {"careers": list(artifacts["label_encoder"].classes_)}

@app.post("/predict", response_model=CareerResult)
def predict(profile: ProfileInput):
    if "model" not in artifacts:
        raise HTTPException(status_code=503, detail="Model not loaded")

    try:
        input_vector = encode_input(profile)
        input_scaled = artifacts["scaler"].transform(input_vector)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Encoding failed: {str(e)}")

    model = artifacts["model"]
    le    = artifacts["label_encoder"]

    pred_index  = model.predict(input_scaled)[0]
    pred_career = le.inverse_transform([pred_index])[0]
    proba       = model.predict_proba(input_scaled)[0]

    top_indices = np.argsort(proba)[::-1][:5]
    top_5 = [
        {
            "career":     le.inverse_transform([i])[0],
            "confidence": round(float(proba[i]) * 100, 2)
        }
        for i in top_indices
    ]

    return CareerResult(
        career=pred_career,
        confidence=round(float(proba[pred_index]) * 100, 2),
        top_5=top_5
    )