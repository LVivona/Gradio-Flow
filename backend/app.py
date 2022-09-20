from flask import Flask, jsonify, request
from flask_cors import CORS
import socket
import argparse
# import importlib
# import asyncio 
# from multiprocessing import Process
import gradio as gr

app = Flask(__name__)
CORS(app)

def portConnection(port : int):
    s = socket.socket(
        socket.AF_INET, socket.SOCK_STREAM)
            
    result = s.connect_ex(("localhost", port))
    if result == 0: return True
    return False


global visable
global process_map
visable = []
process_map = {}

@app.route("/")
def Root():
    return jsonify({"message" :"everything is up amd running... 🚀",})

# def IS_STREAMABLE():
#     pass

# async def subprocess(metadata):
#     # fetch the module
    
#     try :
#         DONT_LISTEN_TO = ['GradioModule', 'register']
#         mode = importlib.import_module(metadata)
#         fn, names = [], []
#         for fn_key in dir(mode):
#             # print(fn_key, type(getattr(mode, fn_key)))
#             attr = getattr(mode, fn_key)
#             # p = print(dir(attr)) if fn_key == "Hello_World" else None
#             if callable(attr) and not fn_key.startswith("__") and  "__decorator__" in dir(attr) and attr.__decorator__ == "__gradio__":
#                 fn.append((getattr(mode, fn_key)))
#                 names.append(getattr(mode, fn_key)().__name__)
#         print(fn, names)
#     except Exception as e:
#         print(e) 
#         raise e 
    
    
#     asyncio.create_task(src.resources.module.tabularGradio(fn, names, listen=2000, metadata=metadata, name=metadata.split('.')[-1]))
#     return 

# @app.route("/api/append/module" , methods=["POST"])
# def append_module():

#     current = request.json
#     # task_cb = Process(target=subprocess, args=(current['module'],))
#     asyncio.run(subprocess(current['module']))
#     # run module until 
#     return jsonify({"executed" : True,
#                     "process" : "ended" })



@app.route("/api/append/port" , methods=["POST"])
def append_port():
    current = request.json
    visable.append(current)
    return jsonify({"executed" : True})

@app.route("/api/append/connection", methods=["POST"])
def append_connection():
    current = request.json
    return jsonify({"executed" : True})

@app.route("/api/remove/port" , methods=["POST"])
def remove_port():
    current = request.json
    print(current)
    visable.remove(current)
    return jsonify({"executed" : True,
                    "ports" : current['port']})


# @app.route("/api/remove/module" , methods=["POST"])
# def remove_module():
#     current = request.json
   
#     visable.remove(current)
#     process_map[current["kwargs"]["metadata"]].terminate()
#     return jsonify({"executed" : True,
#                     "ports" : current['port']})

@app.route("/api/open/ports", methods=["GET"])
def open_ports():
    return jsonify(visable)


if __name__ == "__main__":

    parser = argparse.ArgumentParser()
    parser.add_argument("-p", "--port", help="location of flask api port on local host", default=5000)
    args = parser.parse_args()
    app.run(host="0.0.0.0", port=args.port, debug=True)

   
