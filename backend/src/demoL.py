from resources import GradioModule, register, InterLauncher
import gradio as gr

if __name__ == "__main__":
    description = "Story generation with GPT"
    examples = [["An adventurer is approached by a mysterious stranger in the tavern for a new quest."]]
    demo = gr.Interface.load("models/EleutherAI/gpt-neo-1.3B", description=description, examples=examples)
    InterLauncher("Demo", demo, listen=2000)