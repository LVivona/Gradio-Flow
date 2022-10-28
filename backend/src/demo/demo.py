import argparse
import sys

sys.path.insert(0, "../resources")
from module import GradioModule, register, InterLauncher, tabularGradio
sys.path.insert(0, "../example")
# from examples import Pictionary, FSD, stock_forecast

import gradio as gr

parser = argparse.ArgumentParser()
parser.add_argument("-e", "--examples", help="Examples made to show how to append it your own functon or classes", default="")
parser.add_argument("-l", "--listen", help="send the gradio information to flask api **NOTE error will show up if the api is not up", default=None)
args = parser.parse_args()
gr.close_all()
if args.examples == "class":
    @GradioModule
    class Greeting:

        @register(["text"], ["text"], examples=[["Luca Vivona"]])
        def Hello_World(self, name):
            return f"👋 Hello {name}, and welcome to Gradio Flow 🤗" 

        @register(["number", "number"], ["number"], examples=[[1,1]])
        def add(self, x, y):
            return x + y

    Greeting().launch() if args.listen == None else Greeting().launch(listen=args.listen)

elif args.examples == "function":
    @register(["text"], ["text"], examples=[["Luca Vivona"]])
    def Hello_World(name):
            return f"👋 Hello {name}, and welcome to Gradio Flow 🤗" 

    @register(["number", "number"], ["number"], examples=[[1,1]])
    def add(x, y):
            return x + y
    tabularGradio([Hello_World, add]) if args.listen == None else tabularGradio([Hello_World, add], listen=args.listen)

elif args.examples == "load":
    description = "Story generation with GPT"
    examples = [["An adventurer is approached by a mysterious stranger in the tavern for a new quest."]]
    demo = gr.Interface.load("models/EleutherAI/gpt-neo-1.3B", description=description, examples=examples)
    InterLauncher("Demo", demo) if args.listen == None else InterLauncher("Demo", demo, listen=args.listen)

# elif args.examples == "FSD": FSD().launch() if args.listen == None else FSD().launch(listen=args.listen)

# elif args.examples == "Stonk" : stock_forecast().launch() if args.listen == None else stock_forecast().launch(listen=args.listen)

# else:
    # Pictionary("../example/data/labels.txt", "../example/data/pytorch_model.bin").launch(live=True)  if args.listen == None else Pictionary("../example/data/labels.txt", "../example/data/pytorch_model.bin").launch(live=True, listen=args.listen)