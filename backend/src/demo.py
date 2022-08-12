import gradio as gr


def Hello_World(name):
        return f"Hello {name}, and welcome to Gradio Flow 🤗" 

def add(x, y):
    return x + y

if __name__ == "__main__":
    pass
    #tabularGradio([Hello_World(), add()], ["hello world", "add"], listen=2000)
    #print([key for key, _ in doc.__dict__.items() if not key.startswith("__")])
    #d = Dock()
    #print(d.determinePort(),  d2.port_count)