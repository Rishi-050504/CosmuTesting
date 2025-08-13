
def read_data(filepath):
    try:
        with open(filepath, 'r') as file:
            data = file.readlines()
        return data
    except FileNotFoundError:
        print(f"Error: File not found at {filepath}")
        return []
    except IOError as e:
        print(f"Error: An I/O error occurred: {e}")
        return []

def process_data(data):
    return [line.strip().upper() for line in data]

# Intentionally missing the function call or main block
