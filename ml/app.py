from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

# -------------------------------------------------
# LOAD TRAINED MODEL
# -------------------------------------------------

model = joblib.load("student_performance_model.pkl")

# -------------------------------------------------
# LOAD DATASET
# -------------------------------------------------

data = pd.read_csv("student_performance_3000.csv")


# -------------------------------------------------
# PREDICTION API
# -------------------------------------------------

@app.route("/predict", methods=["POST"])
def predict():

    data_input = request.json

    features = [[
        float(data_input["attendance"]),
        float(data_input["previous_exam"]),
        float(data_input["previous_semester"]),
        float(data_input["assignment"]),
        float(data_input["internal"]),
        float(data_input["study_hours"]),
        float(data_input["participation"]),
        float(data_input["sleep_hours"])
    ]]

    prediction = model.predict(features)[0]

    # Keep score between 0 and 100
    prediction = max(0, min(100, prediction))

    if prediction >= 85:
        category = "Excellent"
    elif prediction >= 70:
        category = "Good"
    elif prediction >= 50:
        category = "Average"
    else:
        category = "Needs Improvement"

    return jsonify({
        "prediction": round(float(prediction), 2),
        "category": category
    })


# -------------------------------------------------
# DASHBOARD API
# -------------------------------------------------

@app.route("/dashboard", methods=["GET"])
def dashboard():

    total_students = len(data)

    average_score = data["Final Performance Score"].mean()
    

    # Performance categories
    excellent = len(
        data[data["Final Performance Score"] >= 85]
    )

    good = len(
        data[
            (data["Final Performance Score"] >= 70) &
            (data["Final Performance Score"] < 85)
        ]
    )

    average = len(
        data[
            (data["Final Performance Score"] >= 50) &
            (data["Final Performance Score"] < 70)
        ]
    )

    needs_improvement = len(
        data[data["Final Performance Score"] < 50]
    )

    # Recent students
    recent_students = data.tail(5)

    students = []

    for _, row in recent_students.iterrows():

        students.append({
            "id": row["Student ID"],
            "name": row["Student Name"],
            "attendance": round(float(row["Attendance Percentage"]), 1),
            "previous_score": round(
                float(row["Previous Exam Score"]), 1
            ),
            "final_score": round(
                float(row["Final Performance Score"]), 1
            ),
            "category": row["Performance Category"]
        })

    return jsonify({

        "total_students": total_students,

        "average_score": round(
            float(average_score), 1
        ),

        "at_risk": needs_improvement,

        "high_performers": excellent,

        "categories": {
            "excellent": excellent,
            "good": good,
            "average": average,
            "needs_improvement": needs_improvement
        },

        "recent_students": students
    })


# -------------------------------------------------
# RUN FLASK SERVER
# -------------------------------------------------
@app.route("/students", methods=["GET"])
def students():

    students_list = []

    for _, row in data.iterrows():

        students_list.append({
            "id": row["Student ID"],
            "name": row["Student Name"],

            "attendance": round(
                float(row["Attendance Percentage"]), 1
            ),

            "previous_score": round(
                float(row["Previous Exam Score"]), 1
            ),

            "previous_semester": round(
                float(row["Previous Semester Score"]), 1
            ),

            "assignment": round(
                float(row["Assignment Score"]), 1
            ),

            "internal_assessment": round(
                float(row["Internal Assessment Score"]), 1
            ),

            "study_hours": round(
                float(row["Study Hours per Day"]), 1
            ),

            "participation": round(
                float(row["Class Participation Percentage"]), 1
            ),

            "sleep_hours": round(
                float(row["Sleep Hours per Day"]), 1
            ),

            "final_score": round(
                float(row["Final Performance Score"]), 1
            ),

            "category": row["Performance Category"]
        })

    return jsonify({
        "students": students_list,
        "total_students": len(students_list)
    })

@app.route("/save_student", methods=["POST"])
def save_student():

    student = request.json

    try:
        # Check if Student ID already exists
        if str(student["student_id"]) in data["Student ID"].astype(str).values:
            return jsonify({
                "error": "Student ID already exists"
            }), 400

        # Create new student record
        new_student = {
            "Student Name": student["name"],
            "Student ID": student["student_id"],
            "Attendance Percentage": float(student["attendance"]),
            "Previous Exam Score": float(student["previous_exam"]),
            "Previous Semester Score": float(student["previous_semester"]),
            "Assignment Score": float(student["assignment"]),
            "Internal Assessment Score": float(student["internal"]),
            "Study Hours per Day": float(student["study_hours"]),
            "Class Participation Percentage": float(student["participation"]),
            "Sleep Hours per Day": float(student["sleep_hours"]),
            "Final Performance Score": float(student["prediction"]),
            "Performance Category": student["category"]
        }

        # Add student to dataframe
        data.loc[len(data)] = new_student

        # Save updated dataset
        data.to_csv(
            "student_performance_3000.csv",
            index=False
        )

        return jsonify({
            "message": "Student saved successfully",
            "student": new_student
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500
if __name__ == "__main__":
    app.run(port=5000, debug=True)