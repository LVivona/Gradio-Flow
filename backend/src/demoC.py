from resources import GradioModule, register, InterLauncher
import gradio as gr

@GradioModule
class Greeting:

    @register(["text"], ["text"], examples=[["Luca Vivona"]])
    def Hello_World(self, name):
        return f"Hello {name}, and welcome to Gradio Flow 🤗" 

    @register(["number", "number"], ["number"], examples=[[1,1]])
    def add(self, x, y):
        return x + y


if __name__ == "__main__":
    # run just gradio
    # Greeting().launch()
    # run it within Gradio-flow
    Greeting().launch(listen=2000)

    