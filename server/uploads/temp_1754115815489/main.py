
def main():
    print("Starting application...")
    user_input = input("Please enter your name: ")
    from utils import greet
    greet(user_input)

if __name__ == "__main__":
    main()
