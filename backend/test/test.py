import unittest
import sys
sys.path.insert(0, "../src/resources")
from module import GradioModule, register

@GradioModule
class test:
        @register(inputs=["text"], outputs=["text"])
        def Hello(self, name):
            return f"Hello, {name}."

        @register(inputs=["text"], outputs=["text"])
        def Goodbye(self, name):
            return f"Goodbye, {name}."
    
@register(inputs=["text"], outputs=["text"])
def Hello(name):
    return f"Hello, {name}."

@register(inputs=["text"], outputs=["text"])
def Goodbye(name):
    return f"Goodbye, {name}."

class GradioFlowTestCase(unittest.TestCase):
    cls = test()
    def test_class_func_return(self):
        self.assertEqual(self.cls.cls.Hello("Luca"), "Hello, Luca.")
        self.assertEqual(self.cls.cls.Goodbye("Luca"), "Goodbye, Luca.")


    def test_func_return(self):
        self.assertEqual(Hello("Luca"), "Hello, Luca.")
        self.assertEqual(Goodbye("Luca"), "Goodbye, Luca.")
  
    

        

unittest.main()