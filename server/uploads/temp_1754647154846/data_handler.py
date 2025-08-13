
def read_data(filepath):
    with open(filepath, 'r') as file:
        data = file.readlines()
    return data
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/data')
def get_data():
    filepath = 'your_data.txt' # Replace with your data file path
    data = read_data(filepath)
    processed_data = process_data(data)
    return jsonify(processed_data)

if __name__ == '__main__':
    app.run(debug=True)
