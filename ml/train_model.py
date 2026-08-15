import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

# -------------------------------------------------
# 1. LOAD DATASET
# -------------------------------------------------

data = pd.read_csv("student_performance_3000.csv")

print("Dataset loaded successfully!")
print("Number of students:", len(data))
print("\nColumns:")
print(data.columns.tolist())


# -------------------------------------------------
# 2. INPUT FEATURES
# -------------------------------------------------

features = [
    "Attendance Percentage",
    "Previous Exam Score",
    "Previous Semester Score",
    "Assignment Score",
    "Internal Assessment Score",
    "Study Hours per Day",
    "Class Participation Percentage",
    "Sleep Hours per Day"
]

target = "Final Performance Score"


# -------------------------------------------------
# 3. CREATE X AND Y
# -------------------------------------------------

X = data[features]
y = data[target]


# -------------------------------------------------
# 4. SPLIT DATA
# -------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)


# -------------------------------------------------
# 5. TRAIN ML MODEL
# -------------------------------------------------

model = RandomForestRegressor(
    n_estimators=200,
    random_state=42
)

model.fit(X_train, y_train)


# -------------------------------------------------
# 6. TEST MODEL
# -------------------------------------------------

predictions = model.predict(X_test)

mae = mean_absolute_error(y_test, predictions)
r2 = r2_score(y_test, predictions)

print("\n-----------------------------")
print("MODEL PERFORMANCE")
print("-----------------------------")

print("Mean Absolute Error:", round(mae, 2))
print("R2 Score:", round(r2, 2))


# -------------------------------------------------
# 7. SAVE TRAINED MODEL
# -------------------------------------------------

joblib.dump(model, "student_performance_model.pkl")

print("\nModel saved successfully!")
print("File: student_performance_model.pkl")