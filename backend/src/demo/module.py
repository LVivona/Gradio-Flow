import sys
sys.path.insert(0, "../")
from src.resources import GradioModule, register

@register(["text"], ["text"], examples=[["Luca Vivona"]])
def Hello_World(name):
            return f"👋 Hello {name}, and welcome to Gradio Flow 🤗" 

@register(["number", "number"], ["number"], examples=[[1,1]])
def add(x, y):
            return x + y
