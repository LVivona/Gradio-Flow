from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder

app = FastAPI()

global STREAMABLE

STREAMABLE = []

@app.get("/")
def root():
    return { "Root" : "Server is up"}

@app.put("/port/append/{stream}")
def push(stream):
    try:
        streamline = jsonable_encoder(stream)
    except E:
        return {"appended" : True, "error" : f"{E}"}

    STREAMABLE.append(jsonable_encoder(streamline))
    return {"appended" : True }

@app.get('/port/open')
def open():
    return jsonable_encoder(STREAMABLE)

@app.put('/port/remove/{stream}')
def remove(stream):
    STREAMABLE.remove(stream)
    return STREAMABLE