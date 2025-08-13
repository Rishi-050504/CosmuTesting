import json
import 

FILENAME = "data.json"

def load_data():
    try:
        with open(FILENAME, 'r') as f:
            return [Student.from_dict(d) for d in json.load(f)]
    except FileNotFoundError:
        return []

def save_data(students):
    with open(FILENAME, 'w') as f:
        json.dump([s.to_dict() for s in students], f, indent=4)

def add_student(students):
    name = input("Enter name: ")
    student_id = input("Enter ID: ")
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

