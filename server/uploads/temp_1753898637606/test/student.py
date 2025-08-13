class Student:
    def __init__(self, name, student_id, grades):
        self.name = name
        self.student_id = student_id
        self.grades = grades

    def average(self):
        return sum(self.grades) / len(self.grades) if self.grades else 0

    def to_dict(self):
        return {
            "name": self.name,
            "student_id": self.student_id,
            "grades": self.grades
        }

    @staticmethod
    def from_dict(data):
        return Student(data['name'], data['student_id'], data['grades'])
