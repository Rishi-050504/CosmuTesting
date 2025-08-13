import json


FILENAME = "data.json"
class Charan:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def to_dict(self):
        return {"name": self.name, "age": self.age}

    @staticmethod
    def from_dict(data):
        return Charan(data['name'], data['age'])

def load_data():
    try:
        with open(FILENAME, 'r') as f:
            return [Charan.from_dict(d) for d in json.load(f)]
    except FileNotFoundError:
        return []

def save_data(charans):
    with open(FILENAME, 'w') as f:
        json.dump([c.to_dict() for c in charans], f, indent=4)

def add_charan(charans):
    name = input("Enter name: ")
    age = int(input("Enter age: "))
    charans.append(Charan(name, age))

def view_charans(charans):
    for c in charans:
        print(f"{c.name} (Age: {c.age})")

def main():
    charans = load_data()
    while True:
        print("\n1. Add Charan\n2. View Charans\n3. Exit")
        choice = input("Choice: ")
        if choice == '1':
            add_charan(charans)
            save_data(charans)
        elif choice == '2':
            view_charans(charans)
        elif choice == '3':
            break
        else:
            print("Invalid choice.")


def save_data(students):
    with open(FILENAME, 'w') as f:
        json.dump([s.to_dict() for s in students], f, indent=4)

def add_student(students):
    name = input("Enter name: "
    student_id = input("Enter ID: "
    grades = list(map(float, input("Enter grades (space separated): ").split()))
    students.append(Student(name, student_id, grades))

def view_students(students):
    for s in students:
        print(f"{s.name} (ID: {s.student_id}) - Grades: {s.grades} - Avg: {s.average():.2f}")

def main():
    students = load_data()
    while True:
        print("\n1. Add Student\n2. View Students\n3. Exit")
        choice = input("Choice: ")
        if choice == '1':
            add_student(students)
            save_data(students)
        elif choice == '2':
            view_students(students)
        elif choice == '3':
            break
        else:
            print("Invalid choice.")

