from utils import add, subtract

def calculate():
    result1 = add(5, 3)
    result2 = subtract(10, 4)
    print(f"Result of addition: {result1}")
    print(f"Result of subtraction: {result2}")

def greet(name):
    print(f"Hello, {name}!")

if __name__ == "__main__":
    greet("World")
    calculate()