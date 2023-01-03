# from typing import Union
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import FileResponse
from fastapi import Request
from fastapi.staticfiles import StaticFiles

class Car(BaseModel):
    city: str
    brand: str
    prod_year: int
    color: str
    usage: int
    body_cond: str
    engine_cond: str
    front_chassis: str
    back_chassis: str
    tpi: float
    gearbox: str

# loading the model
import pickle
import pandas as pd
model_error = '13.62'
model_name = "models/main_model.sav"
fm = open(model_name, 'rb')
model = pickle.load(fm)
fm.close()

app = FastAPI()

app.mount("/web", StaticFiles(directory="web"))

@app.get("/")
async def root(request: Request):
    return FileResponse("web/index.html")

@app.post("/predict")
async def predictor(car: Car):
    X = pd.DataFrame.from_dict([car.dict()])
    X_oh = one_hot(X)

    pred = model.predict(X_oh)
    print(pred[0])
    return {'price': pred[0], 'error': model_error}


# One Hot Encoding
def one_hot(df):
    ctgf = ['city', 'brand', 'color', 'body_cond', 'engine_cond', 'front_chassis', 'back_chassis', 'gearbox']
    for catagory in ctgf:
        oh = pd.get_dummies(df[catagory], prefix=catagory)
        df = pd.concat([df, oh], axis=1)
        df.drop([catagory], axis=1, inplace=True)
    # Add missing cols
    for column in model.feature_names_in_:
        if not column in df.columns:
            df[column] = 0
    # Reorder columns
    df = df[model.feature_names_in_]
    return df

@app.get('/reload')
def model_reload(request: Request):
    fm = open(model_name, 'rb')
    model = pickle.load(fm)
    fm.close()
    return {}