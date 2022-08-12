import gradio as gr
from inspect import getfile, isclass, getmro

import socket
import random
import requests

class Dock:

    def __init__(self) -> None:
            self.num_ports = 20
            self.port_range = (7860, 7880)

    def portConnection(self, port : int):
            s = socket.socket(
                socket.AF_INET, socket.SOCK_STREAM)  
            result = s.connect_ex(("localhost", port))
            if result == 0: return True
            return False

    def determinePort(self, max_trial_count=10):
            trial_count = 0 
            while trial_count <= max_trial_count:
                port=random.randint(*self.port_range)
                if not self.portConnection(port):
                    return port
                trial_count += 1
            raise Exception('Exceeded Max Trial count without finding port')


DOCKER_LOCAL_HOST = '0.0.0.0'
DOCKER_PORT = Dock()

def tabularGradio(funcs, names, name="Tabular Temp Name", **kwargs):
    port= kwargs["port"] if "port" in kwargs else DOCKER_PORT.determinePort()

    try:
        requests.post(f"http://{DOCKER_LOCAL_HOST}:{ kwargs[ 'listen' ] if 'listen' in kwargs else 5000 }/api/append/port", json={"port" : port, "host" : f'http://localhost:{port}', "file" : 'Not Applicable', "name" : name, "kwargs" : kwargs})
    except Exception as e:
        print(f"**{bcolor.BOLD}{bcolor.FAIL}CONNECTION ERROR{bcolor.ENDC}** 🐛The listening api is either not up or you choose the wrong port.🐛 \n {e}")
        return
    
    gr.TabbedInterface(funcs, names).launch(server_port=port,
                                            server_name=f"{DOCKER_LOCAL_HOST}",
                                            inline= kwargs['inline'] if "inline" in kwargs else True,
                                            share=kwargs['share'] if "share" in kwargs else None,
                                            debug=kwargs['debug'] if "debug" in kwargs else False,
                                            enable_queue=kwargs['enable_queue'] if "enable_queue" in kwargs else None,
                                            max_threads=kwargs['max_threads'] if "max_threads" in kwargs else None,
                                            auth=kwargs['auth'] if "auth" in kwargs else None,
                                            auth_message=kwargs['auth_message'] if "auth_message" in kwargs else None,
                                            prevent_thread_lock=kwargs['prevent_thread_lock'] if "prevent_thread_lock" in kwargs else False,
                                            show_error=kwargs['show_error'] if "show_error" in kwargs else True,
                                            show_tips=kwargs['show_tips'] if "show_tips" in kwargs else False,
                                            height=kwargs['height'] if "height" in kwargs else 500,
                                            width=kwargs['width'] if "width" in kwargs else 900,
                                            encrypt=kwargs['encrypt'] if "encrypt" in kwargs else False,
                                            favicon_path=kwargs['favicon_path'] if "favicon_path" in kwargs else None,
                                            ssl_keyfile=kwargs['ssl_keyfile'] if "ssl_keyfile" in kwargs else None,
                                            ssl_certfile=kwargs['ssl_certfile'] if "ssl_certfile" in kwargs else None,
                                            ssl_keyfile_password=kwargs['ssl_keyfile_password'] if "ssl_keyfile_password" in kwargs else None,
                                            quiet=kwargs['quiet'] if "quiet" in kwargs else False)

    try:
        requests.post(f"http://{DOCKER_LOCAL_HOST}:{ kwargs[ 'listen' ] if 'listen' in kwargs else '5000' }/api/remove/port", json={"port" : port, "host" : f'http://localhost:{port}', "file" : 'Not Applicable', "name" : name, "kwargs" : kwargs})
    except Exception as e:
    
        print(f"**{bcolor.BOLD}{bcolor.FAIL}CONNECTION ERROR{bcolor.ENDC}** 🐛The api either lost connection or was turned off...🐛 \n {e}")
    
    return

    
def register(inputs, outputs, examples=None):
    def register_gradio(func):
        def wrap(*args, **kwargs):            
            try:
                self = args[0]
                self.registered_gradio_functons
            except AttributeError:
                print("✨Initializing Class Functions...✨\n")
                self.registered_gradio_functons = dict()

            fn_name = func.__name__ 
            if fn_name in self.registered_gradio_functons: 
                result = func(*args, **kwargs)
                return result
            else:
                self.registered_gradio_functons[fn_name] = dict(inputs=inputs, outputs=outputs, examples=examples)
                return None
        return wrap
    return register_gradio

def GradioModule(cls):
    class Decorator:

        def __init__(self) -> None:
            self.cls = cls()

        def get_funcs(self):
            return [func for func in dir(self.cls) if not func.startswith("__") and type(getattr(self.cls, func, None)) == type(self.get_funcs) ]

        def compile(self, **kwargs):
            print("Just putting on the finishing touches... 🔧🧰")
            for func in self.get_funcs():
                this = getattr(self.cls, func, None)
                if this.__name__ == "wrap":
                    this()

            demos, names = [], []
            for func, param in self.get_registered_gradio_functons().items():                
                names.append(func)
                demos.append(gr.Interface(fn=getattr(self.cls, func, None),
                                            inputs=param['inputs'],
                                            outputs=param['outputs'],
                                            examples=param['examples'],
                                            cache_examples=kwargs['cache_examples'] if "cache_examples" in kwargs else None,
                                            examples_per_page=kwargs['cache_examples'] if "cache_examples" in kwargs else 10,
                                            interpretation=kwargs['interpretation'] if "interpretation" in kwargs else None,
                                            num_shap=kwargs['num_shap'] if "num_shap" in kwargs else 2.0,
                                            title=kwargs['title'] if "title" in kwargs else None,
                                            article=kwargs['article'] if "article" in kwargs else None,
                                            thumbnail=kwargs['thumbnail'] if "thumbnail" in kwargs else None,
                                            css=kwargs['css'] if "css" in kwargs else None,
                                            live=kwargs['live'] if "live" in kwargs else False,
                                            allow_flagging=kwargs['allow_flagging'] if "allow_flagging" in kwargs else None,
                                            theme='default', 
                                            ))
                print(f"{func}....{bcolor.BOLD}{bcolor.OKGREEN} done {bcolor.ENDC}")

            print("\nHappy Visualizing... 🚀")
            return gr.TabbedInterface(demos, names)
            
        def get_registered_gradio_functons(self):
            try:
                self.cls.registered_gradio_functons
            except AttributeError:
                return None
            return self.cls.registered_gradio_functons
        

        def run(self, **kwargs):
            port= kwargs["port"] if "port" in kwargs else DOCKER_PORT.determinePort() 

            try:
                requests.post(f"http://{DOCKER_LOCAL_HOST}:{ kwargs[ 'listen' ] if 'listen' in kwargs else '5000' }/api/append/port", json={"port" : port, "host" : f'http://localhost:{port}', "file" : getfile(self.cls.__class__), "name" : self.cls.__class__.__name__, "kwargs" : kwargs})
            except Exception:
                print(f"**{bcolor.BOLD}{bcolor.FAIL}CONNECTION ERROR{bcolor.ENDC}** 🐛The listening api is either not up or you choose the wrong port.🐛")
                return

            self.compile(live=kwargs[ 'live' ] if "live" in kwargs else False,
                         allow_flagging=kwargs[ 'allow_flagging' ] if "allow_flagging" in kwargs else None,
                         cache_examples=kwargs['cache_examples'] if "cache_examples" in kwargs else None,
                         examples_per_page=kwargs['cache_examples'] if "cache_examples" in kwargs else 10,
                         interpretation=kwargs['interpretation'] if "interpretation" in kwargs else None,
                         num_shap=kwargs['num_shap'] if "num_shap" in kwargs else 2.0,
                         title=kwargs['title'] if "title" in kwargs else None,
                         article=kwargs['article'] if "article" in kwargs else None,
                         thumbnail=kwargs['thumbnail'] if "thumbnail" in kwargs else None,
                         css=kwargs['css'] if "css" in kwargs else None,
                         theme=kwargs['theme'] if "theme" in kwargs else None, 
                         ).launch(server_port=port,
                                  server_name=f"{DOCKER_LOCAL_HOST}",
                                  inline= kwargs['inline'] if "inline" in kwargs else True,
                                  share=kwargs['share'] if "share" in kwargs else None,
                                  debug=kwargs['debug'] if "debug" in kwargs else False,
                                  enable_queue=kwargs['enable_queue'] if "enable_queue" in kwargs else None,
                                  max_threads=kwargs['max_threads'] if "max_threads" in kwargs else None,
                                  auth=kwargs['auth'] if "auth" in kwargs else None,
                                  auth_message=kwargs['auth_message'] if "auth_message" in kwargs else None,
                                  prevent_thread_lock=kwargs['prevent_thread_lock'] if "prevent_thread_lock" in kwargs else False,
                                  show_error=kwargs['show_error'] if "show_error" in kwargs else True,
                                  show_tips=kwargs['show_tips'] if "show_tips" in kwargs else False,
                                  height=kwargs['height'] if "height" in kwargs else 500,
                                  width=kwargs['width'] if "width" in kwargs else 900,
                                  encrypt=kwargs['encrypt'] if "encrypt" in kwargs else False,
                                  favicon_path=kwargs['favicon_path'] if "favicon_path" in kwargs else None,
                                  ssl_keyfile=kwargs['ssl_keyfile'] if "ssl_keyfile" in kwargs else None,
                                  ssl_certfile=kwargs['ssl_certfile'] if "ssl_certfile" in kwargs else None,
                                  ssl_keyfile_password=kwargs['ssl_keyfile_password'] if "ssl_keyfile_password" in kwargs else None,
                                  quiet=kwargs['quiet'] if "quiet" in kwargs else False) 
            try:
                requests.post(f"http://{DOCKER_LOCAL_HOST}:{ kwargs[ 'listen' ] if 'listen' in kwargs else '5000' }/api/remove/port", json={"port" : port, "host" : f'http://localhost:{port}', "file" : getfile(self.cls.__class__), "name" : self.cls.__class__.__name__, "kwargs" : kwargs})
            except Exception:
                print(f"**{bcolor.BOLD}{bcolor.FAIL}CONNECTION ERROR{bcolor.ENDC}** 🐛The api either lost connection or was turned off...🐛")
            return

    return Decorator



class bcolor:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

