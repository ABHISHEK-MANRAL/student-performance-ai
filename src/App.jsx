import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);
const [autoRefresh, setAutoRefresh] = useState(true);
  const [page, setPage] = useState("dashboard");
  const [dashboardData, setDashboardData] = useState(null);
  const [studentsData, setStudentsData] = useState([]);
  const [analyticsStudent, setAnalyticsStudent] = useState(null);
const [studentIdSearch, setStudentIdSearch] = useState("");
  useEffect(() => {

  const fetchDashboard = () => {
    fetch("http://127.0.0.1:5000/dashboard")
      .then((response) => response.json())
      .then((data) => {
        setDashboardData(data);
      })
      .catch((error) => {
        console.error("Dashboard error:", error);
      });
  };

  // Load immediately
  fetchDashboard();

  // Auto refresh every 30 seconds
  if (autoRefresh) {
    const interval = setInterval(fetchDashboard, 30000);

    return () => clearInterval(interval);
  }

}, [autoRefresh]);
useEffect(() => {
  fetch("http://127.0.0.1:5000/students")
    .then((response) => response.json())
    .then((data) => {
      setStudentsData(data.students);
    })
    .catch((error) => {
      console.error("Students error:", error);
    });
}, []);
useEffect(() => {
  document.body.classList.toggle("dark-mode", darkMode);
}, [darkMode]);

  const performanceData = dashboardData
  ? [
      {
        category: "Excellent",
        score: dashboardData.categories.excellent,
      },
      {
        category: "Good",
        score: dashboardData.categories.good,
      },
      {
        category: "Average",
        score: dashboardData.categories.average,
      },
      {
        category: "Needs Improvement",
        score: dashboardData.categories.needs_improvement,
      },
    ]
  : [];

  const [predictionData, setPredictionData] = useState({
  name: "",
  studentId: "",
  attendance: "",
  previous_exam: "",
  previous_semester: "",
  assignment: "",
  internal: "",
  study_hours: "",
  participation: "",
  sleep_hours: ""
});

const [predictionResult, setPredictionResult] = useState(null);
const [loading, setLoading] = useState(false);

const handlePrediction = async () => {
  try {
    setLoading(true);

    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
     body: JSON.stringify({
        attendance: Number(predictionData.attendance),
        previous_exam: Number(predictionData.previous_exam),
        previous_semester: Number(predictionData.previous_semester),
        assignment: Number(predictionData.assignment),
        internal: Number(predictionData.internal),
        study_hours: Number(predictionData.study_hours),
        participation: Number(predictionData.participation),
        sleep_hours: Number(predictionData.sleep_hours)
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Prediction failed");
    }

    setPredictionResult(result);

  } catch (error) {
    console.error(error);
    alert("Unable to connect to the prediction server.");
  } finally {
    setLoading(false);
  }
};
const handleSaveStudent = async () => {
  try {
    const response = await fetch("http://127.0.0.1:5000/save_student", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: predictionData.name,
        student_id: predictionData.studentId,
        attendance: predictionData.attendance,
        previous_exam: predictionData.previous_exam,
        previous_semester: predictionData.previous_semester,
        assignment: predictionData.assignment,
        internal: predictionData.internal,
        study_hours: predictionData.study_hours,
        participation: predictionData.participation,
        sleep_hours: predictionData.sleep_hours,
        prediction: predictionResult.prediction,
        category: predictionResult.category
      })
    });
   

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to save student");
    }

    alert("Student saved successfully!");

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};
const handleAnalyticsSearch = () => {
  const student = studentsData.find(
    (student) =>
      String(student.id).toLowerCase() ===
      studentIdSearch.trim().toLowerCase()
  );

  if (student) {
    setAnalyticsStudent(student);
  } else {
    setAnalyticsStudent(null);
    alert("Student ID not found.");
  }
};

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="logo-section">
          <div className="logo-icon">🎓</div>

          <div>
            <h2>Student Performance</h2>
            <p>AI Prediction System</p>
          </div>
        </div>

        <div
  className={`nav-item ${page === "dashboard" ? "active" : ""}`}
  onClick={() => setPage("dashboard")}
>
  <span>⌂</span>
  <span>Dashboard</span>
</div>

          

         <div
          className={`nav-item ${page === "students" ? "active" : ""}`}
                  onClick={() => setPage("students")}
          >
          <span>👥</span>
          <span>Students</span>
        </div>

          <div
            className={`nav-item ${page === "prediction" ? "active" : ""}`}
            onClick={() => setPage("prediction")}
          >
            <span>🧠</span>
           <span>Prediction</span>
          </div>

          <div
           className={`nav-item ${page === "analytics" ? "active" : ""}`}
            onClick={() => setPage("analytics")}
           >
            <span>📊</span>
                    <span>Analytics</span>
          </div>

          

          <div
            className={`nav-item ${page === "settings" ? "active" : ""}`}
            onClick={() => setPage("settings")}
            >
            <span>⚙</span>
            <span>Settings</span>
          </div>


        <div className="logout">
          <span>↪</span>
          <span>Logout</span>
        </div>

      </aside>


      {/* MAIN CONTENT */}
      <main className="main-content">
       {page === "prediction" ? (
  <div className="prediction-page">

    {/* PAGE HEADER */}
    <div className="prediction-header">
      <div>
        <h1>Student Prediction</h1>
        <p>
          Enter student details to predict academic performance using AI.
        </p>
      </div>
    </div>

    {/* PREDICTION FORM */}
    <div className="prediction-card">

      {/* STUDENT INFORMATION */}
      <div className="form-section">
        <div className="section-title">
          <span className="section-icon">👤</span>
          <div>
            <h3>Student Information</h3>
            <p>Enter basic student details</p>
          </div>
        </div>

        <div className="form-grid">

          <div className="form-group">
            <label>Student Name</label>
            <input
              type="text"
              placeholder="Enter student name"
              value={predictionData.name}
              onChange={(e) =>
                setPredictionData({
                  ...predictionData,
                  name: e.target.value
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Student ID</label>
            <input
              type="text"
              placeholder="Enter student ID"
              value={predictionData.studentId}
              onChange={(e) =>
                setPredictionData({
                  ...predictionData,
                  studentId: e.target.value
                })
              }
            />
          </div>

        </div>
      </div>


      {/* ACADEMIC PERFORMANCE */}
      <div className="form-section">

        <div className="section-title">
          <span className="section-icon">📚</span>
          <div>
            <h3>Academic Performance</h3>
            <p>Enter previous academic assessment scores</p>
          </div>
        </div>

        <div className="form-grid">

          <div className="form-group">
            <label>Attendance Percentage</label>
            <input
              type="number"
              placeholder="e.g. 85"
              value={predictionData.attendance}
              onChange={(e) =>
                setPredictionData({
                  ...predictionData,
                  attendance: e.target.value
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Previous Exam Score</label>
            <input
              type="number"
              placeholder="e.g. 75"
              value={predictionData.previous_exam}
              onChange={(e) =>
                setPredictionData({
                  ...predictionData,
                  previous_exam: e.target.value
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Previous Semester Score</label>
            <input
              type="number"
              placeholder="e.g. 78"
              value={predictionData.previous_semester}
              onChange={(e) =>
                setPredictionData({
                  ...predictionData,
                  previous_semester: e.target.value
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Assignment Score</label>
            <input
              type="number"
              placeholder="e.g. 80"
              value={predictionData.assignment}
              onChange={(e) =>
                setPredictionData({
                  ...predictionData,
                  assignment: e.target.value
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Internal Assessment Score</label>
            <input
              type="number"
              placeholder="e.g. 82"
              value={predictionData.internal}
              onChange={(e) =>
                setPredictionData({
                  ...predictionData,
                  internal: e.target.value
                })
              }
            />
          </div>

        </div>
      </div>


      {/* STUDENT HABITS */}
      <div className="form-section">

        <div className="section-title">
          <span className="section-icon">🎯</span>
          <div>
            <h3>Student Habits & Engagement</h3>
            <p>Enter lifestyle and classroom engagement details</p>
          </div>
        </div>

        <div className="form-grid">

          <div className="form-group">
            <label>Study Hours per Day</label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 5"
              value={predictionData.study_hours}
              onChange={(e) =>
                setPredictionData({
                  ...predictionData,
                  study_hours: e.target.value
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Class Participation Percentage</label>
            <input
              type="number"
              placeholder="e.g. 80"
              value={predictionData.participation}
              onChange={(e) =>
                setPredictionData({
                  ...predictionData,
                  participation: e.target.value
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Sleep Hours per Day</label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 7"
              value={predictionData.sleep_hours}
              onChange={(e) =>
                setPredictionData({
                  ...predictionData,
                  sleep_hours: e.target.value
                })
              }
            />
          </div>

        </div>
      </div>


      {/* PREDICT BUTTON */}
      <button
        className="predict-btn"
        onClick={handlePrediction}
        disabled={loading}
      >
        {loading ? "⏳ Predicting..." : "🧠 Predict Student Performance"}
      </button>


      {/* PREDICTION RESULT */}
      {predictionResult && (
        <div className="prediction-result">

          <div className="result-header">
            <div>
              <h3>Prediction Result</h3>
              <p>AI-generated student performance prediction</p>
            </div>

            <span className="result-icon">✓</span>
          </div>

          <div className="result-grid">

            <div className="result-item">
              <span>Student</span>
              <strong>{predictionData.name}</strong>
            </div>

            <div className="result-item">
              <span>Student ID</span>
              <strong>{predictionData.studentId}</strong>
            </div>

            <div className="result-item highlight">
              <span>Predicted Performance</span>
              <strong>
                {predictionResult.prediction}%
              </strong>
            </div>

            <div className="result-item">
              <span>Performance Category</span>
              <strong>{predictionResult.category}</strong>
            </div>

          </div>

          <button
            className="save-student-btn"
            onClick={handleSaveStudent}
          >
            💾 Save Student Record
          </button>

        </div>
      )}

    </div>

  </div>

) : page === "students" ? (
  <div className="students-page">

    <header className="topbar">
      <div>
        <h1>Students</h1>
        <p>View all student performance records</p>
      </div>
    </header>

    <div className="card students-full-card">

      <div className="card-header">
        <h3>All Students</h3>
        <span>{studentsData.length} Students</span>
      </div>

      <div className="table-container">

        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Attendance</th>
              <th>Previous Score</th>
              <th>Final Score</th>
              <th>Performance</th>
            </tr>
          </thead>

          <tbody>

            {studentsData.map((student) => (
              <tr key={student.id}>

                <td>{student.id}</td>

                <td>{student.name}</td>

                <td>{student.attendance}%</td>

                <td>{student.previous_score}%</td>

                <td>{student.final_score}%</td>

                <td>
                  <span
                    className={`badge ${
                      student.category === "Excellent"
                        ? "excellent"
                        : student.category === "Good"
                        ? "good"
                        : student.category === "Average"
                        ? "average"
                        : "risk"
                    }`}
                  >
                    {student.category}
                  </span>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>

  </div>
) : page === "analytics" ? (
  <div className="analytics-page">

  <h1>Student Analytics</h1>
  <p>Analyze individual student performance.</p>

  <div className="card analytics-search-card">

  <div className="search-header">
    <div>
      <h3>Student Search</h3>
      <p>Find a student's performance using their Student ID</p>
    </div>
  </div>

  <div className="analytics-search">

    <input
      type="text"
      placeholder="Enter Student ID"
      value={studentIdSearch}
      onChange={(e) => setStudentIdSearch(e.target.value)}
    />

    <button onClick={handleAnalyticsSearch}>
      🔍 Search Student
    </button>

  </div>

</div>

 {analyticsStudent && (
  <div className="card student-analysis-card">

    <h2>{analyticsStudent.name}</h2>

    <p>
      Student ID: <strong>{analyticsStudent.id}</strong>
    </p>

    <div className="analysis-grid">

      <div>
        <span>Attendance</span>
        <strong>{analyticsStudent.attendance}%</strong>
      </div>

      <div>
        <span>Previous Score</span>
        <strong>{analyticsStudent.previous_score}%</strong>
      </div>

      <div>
        <span>Final Score</span>
        <strong>{analyticsStudent.final_score}%</strong>
      </div>

      <div>
        <span>Performance</span>
        <strong>{analyticsStudent.category}</strong>
      </div>

    </div>


    {/* ACADEMIC PERFORMANCE */}
    <div className="analytics-chart-card">

      <div className="chart-header">
        <div>
          <h3>Academic Performance</h3>
          <p>Student performance across academic assessments</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>

        <BarChart
          data={[
            {
              factor: "Previous Exam",
              score: Number(analyticsStudent.previous_score)
            },
            {
              factor: "Previous Semester",
              score: Number(analyticsStudent.previous_semester)
            },
            {
              factor: "Assignment",
              score: Number(analyticsStudent.assignment)
            },
            {
              factor: "Internal Assessment",
              score: Number(analyticsStudent.internal_assessment)
            },
            {
              factor: "Final Score",
              score: Number(analyticsStudent.final_score)
            }
          ]}
          margin={{
            top: 25,
            right: 20,
            left: 0,
            bottom: 10
          }}
          barCategoryGap="25%"
        >

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="factor"
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            formatter={(value) => [`${value}%`, "Score"]}
          />

          <Bar
            dataKey="score"
            fill="#2563eb"
            radius={[8, 8, 0, 0]}
            barSize={42}
            label={{
              position: "top",
              formatter: (value) => `${value}%`,
              fontSize: 12
            }}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>


    {/* STUDENT HABITS & ENGAGEMENT */}
    <div className="analytics-chart-card">

      <div className="chart-header">
        <div>
          <h3>Student Habits & Engagement</h3>
          <p>Attendance and classroom participation</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>

        <BarChart
          data={[
            {
              factor: "Attendance",
              score: Number(analyticsStudent.attendance)
            },
            {
              factor: "Participation",
              score: Number(analyticsStudent.participation)
            }
          ]}
          margin={{
            top: 25,
            right: 20,
            left: 0,
            bottom: 10
          }}
          barCategoryGap="30%"
        >

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="factor"
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            formatter={(value) => [`${value}%`, "Score"]}
          />

          <Bar
            dataKey="score"
            fill="#0ea5e9"
            radius={[8, 8, 0, 0]}
            barSize={50}
            label={{
              position: "top",
              formatter: (value) => `${value}%`,
              fontSize: 12
            }}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>


   {/* PERFORMANCE SUMMARY */}
<div className="analytics-summary">

  <div className="summary-card">
    <span>Final Performance</span>
    <strong>{analyticsStudent.final_score}%</strong>
  </div>

  <div className="summary-card">
    <span>Performance Category</span>
    <strong>{analyticsStudent.category}</strong>
  </div>

  <div className="summary-card">
    <span>Study Hours / Day</span>
    <strong>{analyticsStudent.study_hours} hrs</strong>
  </div>

  <div className="summary-card">
    <span>Sleep Hours / Day</span>
    <strong>{analyticsStudent.sleep_hours} hrs</strong>
  </div>

  </div>
</div>
)}
</div>

) : page === "settings" ? (
  <div className="settings-page">

    <h1>Settings</h1>
    <p>Manage application preferences.</p>

    <div className="card settings-card">

      


      <div className="setting-row">
        <div className="setting-info">
          <span className="setting-icon">🌙</span>
          <div>
            <strong>Dark Mode</strong>
            <small>Dark appearance</small>
          </div>
        </div>

        <label className="switch">
         <input
           type="checkbox"
           checked={darkMode}
           onChange={(e) => setDarkMode(e.target.checked)}
         />
          <span className="slider"></span>
        </label>
      </div>


      <div className="setting-row">
        <div className="setting-info">
          <span className="setting-icon">🔄</span>
          <div>
            <strong>Auto Refresh</strong>
            <small>Refresh dashboard data</small>
          </div>
        </div>

        <label className="switch">
         <input
           type="checkbox"
           checked={autoRefresh}
           onChange={(e) => setAutoRefresh(e.target.checked)}
         />
          <span className="slider"></span>
        </label>
      </div>

    </div>

  </div>
):(
  
  
  <>
    

        {/* HEADER */}
        <header className="topbar">

          <div>
            <h1>Dashboard</h1>
            <p>Student performance overview</p>
          </div>

          <div className="profile-section">
            <span className="notification">🔔</span>

            <div className="profile">
              <div className="profile-avatar">T</div>
              <span>Teacher</span>
            </div>
          </div>

        </header>


        {/* STATISTICS */}
        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon blue">👥</div>

            <div>
              <p>Total Students</p>
             <h2>{dashboardData ? dashboardData.total_students : "..."}</h2>
              <span>All Students</span>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon green">📈</div>

            <div>
              <p>Average Score</p>
             <h2>
               {dashboardData ? `${dashboardData.average_score}%` : "..."}
             </h2>
              <span>Class Average</span>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon orange">!</div>

            <div>
              <p>At Risk Students</p>
             <h2>
               {dashboardData ? dashboardData.at_risk : "..."}
             </h2>
              <span>Need Attention</span>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon purple">★</div>

            <div>
              <p>High Performers</p>
             <h2>{dashboardData ? dashboardData.high_performers : "..."}</h2>
              <span>Doing Great</span>
            </div>
          </div>

        </section>


        {/* MIDDLE SECTION */}
        <section className="middle-grid">

          {/* PERFORMANCE DISTRIBUTION */}
<div className="card performance-card">

  <div className="card-header">
    <h3>Performance Distribution</h3>
  </div>

  <div className="performance-graph">

    <div className="graph-y-axis">
      <span>1000</span>
      <span>800</span>
      <span>600</span>
      <span>400</span>
      <span>200</span>
      <span>0</span>
    </div>

    <div className="graph-area">

      <div className="bar-chart">

        {/* Excellent */}
        <div className="bar-item">
          <div
            className="bar excellent-bar"
            style={{
              height: dashboardData
                ? `${(dashboardData.categories.excellent / dashboardData.total_students) * 100}%`
                : "0%"
            }}
          >
            <span>
              {dashboardData
                ? dashboardData.categories.excellent
                : "..."}
            </span>
          </div>
          <p>Excellent</p>
        </div>

        {/* Good */}
        <div className="bar-item">
          <div
            className="bar good-bar"
            style={{
              height: dashboardData
                ? `${(dashboardData.categories.good / dashboardData.total_students) * 100}%`
                : "0%"
            }}
          >
            <span>
              {dashboardData
                ? dashboardData.categories.good
                : "..."}
            </span>
          </div>
          <p>Good</p>
        </div>

        {/* Average */}
        <div className="bar-item">
          <div
            className="bar average-bar"
            style={{
              height: dashboardData
                ? `${(dashboardData.categories.average / dashboardData.total_students) * 100}%`
                : "0%"
            }}
          >
            <span>
              {dashboardData
                ? dashboardData.categories.average
                : "..."}
            </span>
          </div>
          <p>Average</p>
        </div>

        {/* Needs Improvement */}
        <div className="bar-item">
          <div
            className="bar risk-bar"
            style={{
              height: dashboardData
                ? `${(dashboardData.categories.needs_improvement / dashboardData.total_students) * 100}%`
                : "0%"
            }}
          >
            <span>
              {dashboardData
                ? dashboardData.categories.needs_improvement
                : "..."}
            </span>
          </div>
          <p>Needs Improvement</p>
        </div>

      </div>

    </div>

  </div>

</div>

          


          {/* PREDICTION SUMMARY */}
<div className="card prediction-card">

  <h3>Prediction Summary</h3>

  <div className="prediction-content">

    <div
  className="donut"
  style={{
    background: dashboardData
      ? `conic-gradient(
          #22c55e 0deg ${(dashboardData.categories.excellent / dashboardData.total_students) * 360}deg,
          #2563eb ${(dashboardData.categories.excellent / dashboardData.total_students) * 360}deg ${((dashboardData.categories.excellent + dashboardData.categories.good) / dashboardData.total_students) * 360}deg,
          #f59e0b ${((dashboardData.categories.excellent + dashboardData.categories.good) / dashboardData.total_students) * 360}deg ${((dashboardData.categories.excellent + dashboardData.categories.good + dashboardData.categories.average) / dashboardData.total_students) * 360}deg,
          #ef4444 ${((dashboardData.categories.excellent + dashboardData.categories.good + dashboardData.categories.average) / dashboardData.total_students) * 360}deg 360deg
        )`
      : "#e5e7eb"
  }}
>
  <div className="donut-center">
    <strong>
      {dashboardData ? dashboardData.total_students : "..."}
    </strong>
    <span>Students</span>
  </div>
</div>

    <div className="prediction-list">

      <div className="prediction-item">
        <span className="dot high"></span>

        <div>
          <strong>Excellent</strong>
          <p>
            {dashboardData
              ? dashboardData.categories.excellent
              : "..."} Students
          </p>
        </div>
      </div>

      <div className="prediction-item">
        <span className="dot medium"></span>

        <div>
          <strong>Good</strong>
          <p>
            {dashboardData
              ? dashboardData.categories.good
              : "..."} Students
          </p>
        </div>
      </div>

      <div className="prediction-item">
        <span className="dot average-dot"></span>

        <div>
          <strong>Average</strong>
          <p>
            {dashboardData
              ? dashboardData.categories.average
              : "..."} Students
          </p>
        </div>
      </div>

      <div className="prediction-item">
        <span className="dot low"></span>

        <div>
          <strong>Needs Improvement</strong>
          <p>
            {dashboardData
              ? dashboardData.categories.needs_improvement
              : "..."} Students
          </p>
        </div>
      </div>

    </div>

  </div>

</div>

        </section>


        {/* BOTTOM SECTION */}
        <section className="bottom-grid">

          {/* RECENT STUDENTS */}
          <div className="card students-card">

            <div className="card-header">
              <h3>Recent Students</h3>
             <button onClick={() => setPage("students")}>
               View All →
             </button>
            </div>

            <div className="table-container">

              <table>

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Attendance</th>
                    <th>Previous Score</th>
                    <th>Predicted</th>
                    <th>Performance</th>
                  </tr>
                </thead>

                <tbody>

                  {dashboardData &&
  dashboardData.recent_students.map((student) => (
    <tr key={student.id}>
      <td>{student.id}</td>

      <td>{student.name}</td>

      <td>{student.attendance}%</td>

      <td>{student.previous_score}%</td>

      <td>{student.final_score}%</td>

      <td>
        <span
          className={`badge ${
            student.category === "Excellent"
              ? "excellent"
              : student.category === "Good"
              ? "good"
              : student.category === "Average"
              ? "average"
              : "risk"
          }`}
        >
          {student.category}
        </span>
      </td>
    </tr>
  ))}

                </tbody>

              </table>

            </div>

          </div>


          {/* QUICK PREDICTION */}
          <div className="card quick-card">

            <h3>Quick Prediction</h3>

            <p className="quick-subtitle">
              Start an AI performance prediction.
            </p>

            <label>Student Name</label>

            <input
              type="text"
              placeholder="Enter student name"
            />


            <label>Student ID</label>

            <input
              type="text"
              placeholder="Enter student ID"
            />


            <button
              className="predict-btn"
              onClick={() => setPage("prediction")}
            >
              🧠 Go to Prediction
            </button>

            <p className="prediction-help">
              Enter complete student details on the Prediction page.
            </p>

          </div>

                </section>

      </>
      )}
    </main>
    </div>
  );
}

export default App;