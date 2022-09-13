import requests
DOCKER_LOCAL_HOST = '0.0.0.0' 
import gradio as gr
import asyncio
if __name__ == "__main__":
    gr.close_all()
    requests.post(f"http://{DOCKER_LOCAL_HOST}:{ 2000 }/api/append/module", json={"module" : "src.demo.module"})
