import gradio as gr
from resources import register, tabularGradio

@register(["text"], ["text"], examples=[["Luca Vivona"]])
def Hello_World(name):
        return f"Hello {name}, and welcome to Gradio Flow 🤗" 

@register(["number", "number"], ["number"], examples=[[1,1]])
def add(x, y):
    return x + y

if __name__ == "__main__":
    tabularGradio([Hello_World(), add()], ["Hello World", "Add"], listen=2000)
