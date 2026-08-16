##  Student Performance AI
 An AI-powered student performance prediction and analytics system that helps analyze academic performance and predict a student's final performance score based on multiple academic and behavioral factors.

---
## Project Overview
Student Performance AI is a web-based application designed to analyze student performance and provide AI-based predictions.

The system takes important student factors such as attendance, previous examination scores, assignments, internal assessment, study hours, class participation, and sleep hours to predict the student's final performance.

The application also provides a dashboard for viewing student statistics and individual performance analytics.

##  Features

- 📊 Student performance dashboard
- 🤖 AI-based student performance prediction
- 👨‍🎓 Student records and performance overview
- 📈 Performance analytics
- 📋 Prediction result categorization
- ⚙️ Settings page
- 📱 Responsive user interface
- 📊 Visual performance distribution and prediction summary
- 💾 Machine learning model for prediction

---

##  Tech Stack

### Frontend
- React.js
- Vite
- HTML
- CSS
- JavaScript

### Backend
- Python
- Flask

### Machine Learning
- Python
- Pandas
- Scikit-learn
- Pickle

### Development Tools
- Visual Studio Code
- Git
- GitHub

---

##  Prediction Factors

The machine learning model uses the following student-related features:

- Attendance Percentage
- Previous Exam Score
- Previous Semester Score
- Assignment Score
- Internal Assessment Score
- Study Hours per Day
- Class Participation Percentage
- Sleep Hours per Day

---

##  Performance Categories

| Score | Category |
|---|---|
| 85–100 | Excellent |
| 70–84 | Good |
| 50–69 | Average |
| Below 50 | Needs Improvement |

---

##  Project Structure

```text
student-performance-ai/
│
├── ml/
│   ├── app.py
│   ├── train_model.py
│   ├── student_performance_3000.csv
│   └── student_performance_model.pkl
│
├── public/
│
├── screenshots/
│   ├── 01-dashboard.png
│   ├── 02-prediction.png
│   ├── 03-prediction.png
│   ├── 04-students.png
│   ├── 05-analytics.png
│   ├── 06-analytics.png
│   └── 07-settings.png
│
├── src/
│   ├── assets/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

##  Installation
1. Clone the repository
git clone https://github.com/ABHISHEK-MANRAL/student-performance-ai.git
2. Navigate to the project
cd student-performance-ai
3. Install frontend dependencies
npm install
4. Install Python dependencies

Make sure Python is installed on your system.

pip install flask pandas scikit-learn
##  Running the Project
Start the Flask backend

Open a terminal in the project folder and run:

python ml/app.py

Keep this terminal running.

Start the React frontend

Open another terminal in the project folder and run:

npm run dev

The Vite development server will provide a local URL in the terminal, usually:

http://localhost:5173

Open that URL in your browser.

## How the System Works
Student Details
       ↓
Frontend (React)
       ↓
Flask Backend
       ↓
Machine Learning Model
       ↓
Performance Prediction
       ↓
Performance Category
       ↓
Dashboard & Analytics

##  Screenshots
1. Dashboard
<img src="./screenshots/01-dashboard.png" alt="Dashboard" width="100%">
2. Student Prediction
<img src="./screenshots/02-prediction.png" alt="Student Prediction" width="100%">
3. Student Prediction Result
<img src="./screenshots/03-prediction.png" alt="Prediction Result" width="100%">
4. Students
<img src="./screenshots/04-students.png" alt="Students" width="100%">
5. Student Analytics
<img src="./screenshots/05-analytics.png" alt="Student Analytics" width="100%">
6. Analytics Result
<img src="./screenshots/06-analytics.png" alt="Analytics Result" width="100%">
7. Settings
<img src="./screenshots/07-settings.png" alt="Settings" width="100%">

##  Dataset

The project includes a student performance dataset containing 3,000 student records.

The dataset is used for training and working with the student performance prediction model.

Dataset file:
ml/student_performance_3000.csv

## Machine Learning Model

The trained machine learning model is stored in:

ml/student_performance_model.pkl

The training script is:

ml/train_model.py

To retrain the model:

python ml/train_model.py

## Future Scope
Improve prediction accuracy with additional models
Add more student performance features
Add user authentication
Add database integration
Deploy the application online
Add advanced performance reports
Add automated recommendations for students

## Author

Abhishek Manral

B.Tech – Data Science
Greater Noida Institute of Technology