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

@register(['number', 'number'], ['number'], examples=[[9, 10]])
def add(x=0, y=0):
    return x + y

@register(['number'], ['number'], examples=[[9, 10]])
def error_param(x=0, y=0):
    return x + y

@register(['number', "number"], [], examples=[[9, 10]])
def error_no_output(x=0, y=0):
    return x + y

@register(['number', "number"], "number", examples=[[9, 10]])
def foo(x=0, y=0):
    return x + y




class GradioFlowTestCase(unittest.TestCase):
    hodl = test()
    def test_class_func_return(self):
        self.assertEqual(self.hodl.__cls__.Hello("Luca"), "Hello, Luca.")
        self.assertEqual(self.hodl.__cls__.Goodbye("Luca"), "Goodbye, Luca.")

    def test_func_default_return(self):
        self.assertEqual(add(1,1), 2)

    def test_func_return(self):
        self.assertEqual(Hello("Luca"), "Hello, Luca.")
        self.assertEqual(Goodbye("Luca"), "Goodbye, Luca.")

    def test_foo(self):
        self.assertEqual(foo(1,1),2)

    def test_functions_error_catch(self):
        with self.assertRaises(AssertionError):
            error_param()
    
    def test_function_error_no_output(self):
        with self.assertRaises(AssertionError):
            error_no_output()
  

unittest.main()