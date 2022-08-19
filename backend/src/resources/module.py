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
    """
    takes all gradio Interfaces, and names
    from input and launch the gradio.
    """

    assert len(funcs) == len(names), f"{bcolor.BOLD}{bcolor.FAIL}🐛 something went wrong!!! The function you appended dose not match the length of the names{bcolor.ENDC}"
    port= kwargs["port"] if "port" in kwargs else DOCKER_PORT.determinePort()
    
    # send this to the backend api for it to be read by the react frontend
    if 'listen' in kwargs:
        try:
            requests.post(f"http://{DOCKER_LOCAL_HOST}:{ kwargs[ 'listen' ] }/api/append/port", json={"port" : port, "host" : f'http://localhost:{port}', "file" : 'Not Applicable', "name" : name, "kwargs" : kwargs})
        except Exception as e:
            print(f"**{bcolor.BOLD}{bcolor.FAIL}CONNECTION ERROR{bcolor.ENDC}** 🐛The listening api is either not up or you choose the wrong port.🐛 \n {e}")
            return
    
    # provided by gradio a tabularInterface function that take function and names
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
    
    # Ctrl+C that ends the process and then continue the code which will remove from the api
    if 'listen' in kwargs:
        try:
            requests.post(f"http://{DOCKER_LOCAL_HOST}:{ kwargs[ 'listen' ] }/api/remove/port", json={"port" : port, "host" : f'http://localhost:{port}', "file" : 'Not Applicable', "name" : name, "kwargs" : kwargs})
        except Exception as e:    
            print(f"**{bcolor.BOLD}{bcolor.FAIL}CONNECTION ERROR{bcolor.ENDC}** 🐛The api either lost connection or was turned off...🐛 \n {e}")
    
    return



def register(inputs, outputs, examples=None, **kwargs):
    def register_gradio(func):
        

        def decorator(*args, **wargs):                    
            if type(outputs) is list:
                assert len(outputs) >= 1, f"❌ {bcolor.BOLD}{bcolor.FAIL}you have no outputs 🤨... {str(type(outputs))} {bcolor.ENDC}"
            
            fn_name = func.__name__ 
            if 'self' in func.__code__.co_varnames and func.__code__.co_varnames[0] == 'self' and fn_name in dir(args[0]):     
                """
                given the decorator is on a class then
                initialize a registered_gradio_functons
                if not already initialize.
                """
               
                if type(inputs) is list:
                    assert len(inputs) == func.__code__.co_argcount - 1, f"❌ {bcolor.BOLD}{bcolor.FAIL}inputs should have the same length as arguments{bcolor.ENDC}"

                try:
                    self = args[0]
                    self.registered_gradio_functons
                except AttributeError:
                    self.registered_gradio_functons = dict()
                
                if not fn_name in self.registered_gradio_functons:
                    self.registered_gradio_functons[fn_name] = dict(inputs=inputs,
                                                                    outputs=outputs, 
                                                                    examples=examples,
                                                                    cache_examples=kwargs['cache_examples'] if "cache_examples" in kwargs else None,
                                                                    examples_per_page=kwargs['examples_per_page'] if "examples_per_page" in kwargs else 10,
                                                                    interpretation=kwargs['interpretation'] if "interpretation" in kwargs else None,
                                                                    num_shap=kwargs['num_shap'] if "num_shap" in kwargs else 2.0,
                                                                    title=kwargs['title'] if "title" in kwargs else None,
                                                                    article=kwargs['article'] if "article" in kwargs else None,
                                                                    thumbnail=kwargs['thumbnail'] if "thumbnail" in kwargs else None,
                                                                    css=kwargs['css'] if "css" in kwargs else None,
                                                                    live=kwargs['live'] if "live" in kwargs else False,
                                                                    allow_flagging=kwargs['allow_flagging'] if "allow_flagging" in kwargs else None,
                                                                    theme=kwargs['theme'] if "theme" in kwargs else  'default', )

                if len(args[1:]) == (func.__code__.co_argcount - 1):
                    return func(*args, **wargs) 
                return None
            else :
                """
                the function is not a class function
                """
                if type(inputs) is list:    
                    assert len(inputs) == func.__code__.co_argcount, f"❌ {bcolor.BOLD}{bcolor.FAIL}inputs should have the same length as arguments{bcolor.ENDC}"

                # if the arguments within the functions are inputed then just return the output
                if len(args) == (func.__code__.co_argcount):
                    return func(*args, **wargs)

                # if there is nothing in the arugumrnt then return the gradio interface
                return gr.Interface(fn=func,
                                    inputs=inputs,
                                    outputs=outputs,
                                    examples=examples,
                                    cache_examples=kwargs['cache_examples'] if "cache_examples" in kwargs else None,
                                    examples_per_page=kwargs['examples_per_page'] if "examples_per_page" in kwargs else 10,
                                    interpretation=kwargs['interpretation'] if "interpretation" in kwargs else None,
                                    num_shap=kwargs['num_shap'] if "num_shap" in kwargs else 2.0,
                                    title=kwargs['title'] if "title" in kwargs else None,
                                    article=kwargs['article'] if "article" in kwargs else None,
                                    thumbnail=kwargs['thumbnail'] if "thumbnail" in kwargs else None,
                                    css=kwargs['css'] if "css" in kwargs else None,
                                    live=kwargs['live'] if "live" in kwargs else False,
                                    allow_flagging=kwargs['allow_flagging'] if "allow_flagging" in kwargs else None,
                                    theme='default', 
                                    )
        return decorator
    return register_gradio

def GradioModule(cls):
    class Decorator:

        def __init__(self) -> None:
            self.__cls__ = cls()
            self.__get_funcs_attr()
            self.interface = self.__compile()
        
        def get_funcs_names(self):
            assert self.get_registered_map() != None, "this is not possible..."
            return [ name for name in self.get_registered_map().keys()]

        def get_registered_map(self):
            assert self.__cls__.registered_gradio_functons != None, "what happen!!!!"
            return self.__cls__.registered_gradio_functons
        
        def __get_funcs_attr(self):
            for func in dir(self.__cls__):
                fn = getattr(self.__cls__, func, None)
                if not func.startswith("__") and fn.__name__ == "decorator":
                    fn()

        def __compile(self):
            """
            Initialize all the function 
            within the class that are registeed
            """
            demos, names = [], []
            for func, param in self.get_registered_map().items():                
                names.append(func)
                try:
                    demos.append(gr.Interface(fn=getattr(self.__cls__, func, None), **param))
                except Exception as e :
                    raise e

            print(f"{bcolor.OKBLUE}COMPLETED: {bcolor.ENDC}All functions are mapped, and ready to launch 🚀",
                 "\n===========================================================\n")
            return gr.TabbedInterface(demos, names)
            
        def launch(self, **kwargs):
            port= kwargs["port"] if "port" in kwargs else DOCKER_PORT.determinePort() 
            if 'listen' in kwargs:
                try:
                    requests.post(f"http://{DOCKER_LOCAL_HOST}:{ kwargs[ 'listen' ] }/api/append/port", json={"port" : port, "host" : f'http://localhost:{port}', "file" : getfile(self.__cls__.__class__), "name" : self.__cls__.__class__.__name__, "kwargs" : kwargs})
                except Exception:
                    print(f"**{bcolor.BOLD}{bcolor.FAIL}CONNECTION ERROR{bcolor.ENDC}** 🐛The listening api is either not up or you choose the wrong port.🐛")
                    return

            self.interface.launch(server_port=port,
                                  server_name=f"{DOCKER_LOCAL_HOST}",
                                  inline= kwargs['inline'] if "inline" in kwargs else None,
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
            if 'listen' in kwargs:
                try:
                    requests.post(f"http://{DOCKER_LOCAL_HOST}:{ kwargs[ 'listen' ] }/api/remove/port", json={"port" : port, "host" : f'http://localhost:{port}', "file" : getfile(self.__cls__.__class__), "name" : self.__cls__.__class__.__name__, "kwargs" : kwargs})
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

