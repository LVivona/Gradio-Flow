from resources import GradioModule, register
import gradio as gr

@GradioModule
class Greeting:

    @register(["text"], ["text"])
    def Hello_World(self, name):
        return f"Hello {name}, and welcome to Gradio Flow 🤗" 

@register(["text"], ["text"])
def Hello_World(name):
    return f"Hello {name}, and welcome to Gradio Flow 🤗" 


if __name__ == "__main__":
    Greeting().run(listen=2000) 