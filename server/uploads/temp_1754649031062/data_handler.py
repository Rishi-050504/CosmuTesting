def create_data(filepath, new_data):
    with open(filepath, 'a') as file:
        file.write(new_data + '\n')

def read_data(filepath):
    with open(filepath, 'r') as file:
        data = file.readlines()
    return data

def update_data(filepath, index, updated_data):
    with open(filepath, 'r') as file:
        data = file.readlines()
    if 0 <= index < len(data):
        data[index] = updated_data + '\n'
        with open(filepath, 'w') as file:
            file.writelines(data)

def delete_data(filepath, index):
    with open(filepath, 'r') as file:
        data = file.readlines()
    if 0 <= index < len(data):
        del data[index]
        with open(filepath, 'w') as file:
            file.writelines(data)

def process_data(data):
    return [line.strip().upper() for line in data]