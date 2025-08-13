from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    try:
        return 'Hello from Backend'
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
