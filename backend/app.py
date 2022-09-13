from flask import Flask, jsonify, request
from flask_cors import CORS
import socket
import argparse

app = Flask(__name__)
CORS(app)

def portConnection(port : int):
    s = socket.socket(
        socket.AF_INET, socket.SOCK_STREAM)
            
    result = s.connect_ex(("localhost", port))
    if result == 0: return True
    return False


global visable, watcher, dog
visable = []

@app.route("/")
def Root():
    return jsonify({"message" :"everything is up amd running... 🚀",})

@app.route("/api/append/port" , methods=["POST"])
def append_port():
    current = request.json
    visable.append(current)
    return jsonify({"executed" : True})

@app.route("/api/remove/port" , methods=["POST"])
def remove_port():
    current = request.json
    print(current)
    visable.remove(current)
    return jsonify({"executed" : True,
                    "ports" : current['port']})


@app.route("/api/open/ports", methods=["GET"])
def open_ports():
    return jsonify(visable)


if __name__ == "__main__":

    parser = argparse.ArgumentParser()
    parser.add_argument("-p", "--port", help="location of flask api port on local host", default=5000)
    args = parser.parse_args()
    app.run(host="0.0.0.0", port=args.port, debug=True)