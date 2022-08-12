from resources import GradioModule, register

@GradioModule
class Greeting:

    @register(["text"], ["text"])
    def Hello_World(self, name):
        return f"Hello {name}, and welcome to Gradio Flow 🤗" 

    @register(["number", "number"], ["number"], examples=[[1,1]])
    def add(self, x, y):
        return x + y

if __name__ == "__main__":
    Greeting().run(listen=2000)