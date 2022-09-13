import gradio as gr
import sys
import matplotlib
import matplotlib.pyplot as plt
from pathlib import Path
import torch
from torch import nn
import numpy as np
import PIL
sys.path.insert(0, "../resources")
from module import GradioModule, register


@GradioModule
class Pictionary:

    def __init__(self, txt, model) -> None:
        self.LABELS = Path(txt).read_text().splitlines()
        print(txt, model)
        self.model = nn.Sequential(
                nn.Conv2d(1, 32, 3, padding='same'),
                nn.ReLU(),
                nn.MaxPool2d(2),
                nn.Conv2d(32, 64, 3, padding='same'),
                nn.ReLU(),
                nn.MaxPool2d(2),
                nn.Conv2d(64, 128, 3, padding='same'),
                nn.ReLU(),
                nn.MaxPool2d(2),
                nn.Flatten(),
                nn.Linear(1152, 256),
                nn.ReLU(),
                nn.Linear(256, len(self.LABELS)),
                )   
        state_dict = torch.load(model,    map_location='cpu')
        self.model.load_state_dict(state_dict, strict=False)
        self.model.eval()

    @register(inputs="sketchpad", outputs=gr.Label(), examples=None, live=True)
    def perdict(self, img) -> 'dict[str, float]':
        if type(img) == type(None): return {}
        x = torch.tensor(img, dtype=torch.float32).unsqueeze(0).unsqueeze(0) / 255.
        with torch.no_grad():
            out = self.model(x)
        probabilities = torch.nn.functional.softmax(out[0], dim=0)
        values, indices = torch.topk(probabilities, 5)
        confidences = {self.LABELS[i]: v.item() for i, v in zip(indices, values)}
        return confidences

@GradioModule
class HelloWorld_2_0:

    @register(inputs=["text", "text", gr.Radio(["morning", "evening", "night"])], outputs="text")
    def Hello(self, Lname : str, Fname : str, day : 'list[any]'=["morning", "evening", "night"]) -> str:
        return "Hello, {} {}".format(Fname, Lname)  

    @register(inputs=["text", "text"], outputs="text")
    def goodbye(self, Fname : str, Lname : str) -> str:
        return "Goodbye, {} {}".format(Fname, Lname)  
    
    @register(inputs=["text", gr.Checkbox() , gr.Slider(0, 60)], outputs=["text", "number"])
    def greet(self, name, is_morning, temperature):
        salutation = "Good morning" if is_morning else "Good evening"
        greeting = "%s %s. It is %s degrees today" % (salutation, name, temperature)
        celsius = (temperature - 32) * 5 / 9
        return (greeting, round(celsius, 2))



@GradioModule
class FSD:

    def get_new_val(self, old_val, nc):
        return np.round(old_val * (nc - 1)) / (nc - 1)


    def palette_reduce(self, img : PIL.Image.Image, nc):
        pixels = np.array(img, dtype=float) / 255
        pixels = self.get_new_val(pixels, nc)

        carr = np.array(pixels / np.max(pixels) * 255, dtype=np.uint8)
        return PIL.Image.fromarray(carr)

    @register(inputs=[gr.Image(), gr.Slider(0.00, 16)], outputs=gr.Gallery())
    def Floyd_Steinberg_dithering(self, img, nc  ):
        pixels = np.array(img, dtype=float) / 255
        new_height, new_width, _ = img.shape 
        for row in range(new_height):
            for col in range(new_width):
                old_val = pixels[row, col].copy()
                new_val = self.get_new_val(old_val, nc)
                pixels[row, col] = new_val
                err = old_val - new_val
                if col < new_width - 1:
                    pixels[row, col + 1] += err * 7 / 16
                if row < new_height - 1:
                    if col > 0:
                        pixels[row + 1, col - 1] += err * 3 / 16
                    pixels[row + 1, col] += err * 5 / 16
                    if col < new_width - 1:
                        pixels[row + 1, col + 1] += err * 1 / 16
        carr = np.array(pixels / np.max(pixels, axis=(0, 1)) * 255, dtype=np.uint8)
        return [PIL.Image.fromarray(carr), self.palette_reduce(img, nc) ]

@GradioModule
class stock_forecast:
    
    def __init__(self):
        matplotlib.use('Agg')

    @register(inputs=[gr.Checkbox(label="legend"), gr.Radio([2025, 2030, 2035, 2040], label="projct"), gr.CheckboxGroup(["Google", "Microsoft", "Gradio"], label="company"), gr.Slider(label="noise"), gr.Radio(["cross", "line", "circle"], label="style")], outputs=[gr.Plot()])
    def plot_forcast(self, legend, project, companies , noise , styles)-> matplotlib.figure.Figure:
        start_year = 2022
        x = np.arange(start_year, project + 1)
        year_count = x.shape[0]
        plt_format = ({"cross": "X", "line": "-", "circle": "o--"})[styles]
        fig = plt.figure()
        ax = fig.add_subplot(111)
        for i, company in enumerate(companies):
            series = np.arange(0, year_count, dtype=float)
            series = series**2 * (i + 1)
            series += np.random.rand(year_count) * noise
            ax.plot(x, series, plt_format)
        if legend:
            plt.legend(companies)
        print(type(fig))
        return fig 
