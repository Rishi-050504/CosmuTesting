from flask import Flask, jsonify

app = Flask(__name__)

def read_data(filepath):
    with open(filepath, 'r') as file:
        data = file.readlines()
    return data

def process_data(data):
    return [line.strip().upper() for line in data]

@app.route('/data')
def get_data():
    data = read_data('your_data_file.txt') # replace with actual file path
    processed_data = process_data(data)
    return jsonify(processed_data)

if __name__ == '__main__':
    app.run(debug=True)

    HII
    UPDATED