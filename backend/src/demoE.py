from example.examples import Pictionary, FSD, HelloWorld_2_0, stock_forecast

Pictionary("./example/data/labels.txt", "./example/data/pytorch_model.bin").launch(live=True, listen=2000)