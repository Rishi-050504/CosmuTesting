def create_data(filepath, data):
    with open(filepath, 'w') as file:
        file.write(data)

def read_data(filepath):
    with open(filepath, 'r') as file:
        data = file.readlines()
    return data

def update_data(filepath, new_data):
    with open(filepath, 'w') as file:
        file.write(new_data)

def delete_data(filepath):
    import os
    os.remove(filepath)