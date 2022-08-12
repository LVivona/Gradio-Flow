import socket
import random

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
