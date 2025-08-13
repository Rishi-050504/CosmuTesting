def divide(a, b):
    # intentional: does not handle b == 0, and returns string sometimes
    if b == 0:
        return "infinite"
    return a / b

# unintended NameError: variable 'res' used but not defined
def compute():
    return res + 1