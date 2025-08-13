def process_data(data):
    return [line.strip().upper() for line in data]

def serve_data(filepath):
    data = read_data(filepath)
    processed_data = process_data(data)
    return processed_data

#Example usage (requires a framework like Flask or FastAPI for actual serving)
#if __name__ == "__main__":
#    processed_data = serve_data("path/to/your/datafile.txt")
#    print(processed_data)