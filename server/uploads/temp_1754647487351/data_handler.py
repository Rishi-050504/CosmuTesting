
def read_data(filepath):
    with open(filepath, 'r') as file:
        data = file.readlines()
    return data

def process_data(data):
    return [line.strip().upper() for line in data]

# Intentionally missing the function call or main block
