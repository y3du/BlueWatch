BlueWatch
BlueWatch is a full-stack web application designed to analyze, process, and visualize data, likely related to social media sentiment or threat analysis. It features a Python backend for data processing and machine learning, paired with a modern React frontend for interactive visualizations and user interaction.


Overview
BlueWatch enables users to input data, process it through a robust backend, and visualize the results through a dynamic dashboard. The application likely focuses on sentiment analysis, threat detection, and severity assessment, utilizing machine learning models and interactive charts like Emotion Bar Graphs, Threat Gauges, Severity Histograms, Word Clouds, Timeline Charts, Network Graphs, and Entity Tables.
Key Features

User Authentication: Secure login and user management system.
Data Input & Processing: Users can input data via forms, processed by the backend.
Sentiment & Threat Analysis: Backend leverages machine learning (e.g., PyTorch, TensorFlow) for emotion, threat, and severity analysis.
Interactive Visualizations:
Emotion Bar Graphs
Threat Gauges
Severity Histograms
Word Clouds
Timeline Charts
Network Graphs
Entity Tables


Dashboard: Centralized interface to view all analytics and visualizations.
API Endpoints: RESTful API for seamless frontend-backend communication.

Tech Stack

Frontend: React.js with custom CSS for styling and visualizations
Backend: Python (likely Flask or FastAPI, with a virtual environment)
Data Science/ML: PyTorch, TensorFlow, Transformers (inferred from dependencies)
Other Libraries: Markdown, MarkupSafe, tqdm, spaCy, SymPy, and more

Project Structure
BlueWatch/
│
├── backend/                    # Python backend (API, ML, data processing)
│   ├── app.py                  # Main backend application
│   ├── venv/                   # Virtual environment (excluded from git)
│   └── ...                     # Other backend files
│
├── frontend/                   # React frontend
│   └── src/
│       ├── components/         # React components
│       │   ├── Dashboard.jsx
│       │   ├── DataInputForm.css
│       │   ├── EmotionBarGraph.css
│       │   ├── ThreatGauge.css
│       │   ├── SeverityHistogram.jsx
│       │   ├── WordCloud.css
│       │   ├── TimelineChart.css
│       │   ├── NetworkGraph.css
│       │   ├── EntityTable.jsx
│       │   └── ...
│       ├── theme.css           # Global theme styles
│       ├── print.css           # Print-specific styles
│       └── backup_styles.css   # Backup styles
│
├── .gitignore                  # Git ignore file
└── README.md                   # This file

Screenshots
Below are screenshots showcasing the application's output.

![Screenshot 2025-04-21 122918](https://github.com/user-attachments/assets/d72cbbc9-ad31-4a2a-8f99-2b30b681d1cb)


Setup Instructions
Prerequisites

Python 3.x
Node.js and npm

Backend Setup

Navigate to the backend folder:cd backend


Create and activate a virtual environment:python -m venv venv
venv\Scripts\activate  # On Windows
source venv/bin/activate  # On macOS/Linux


Install dependencies:pip install -r requirements.txt


Run the backend server:python app.py



Frontend Setup

Navigate to the frontend folder:cd frontend


Install dependencies:npm install


Start the frontend server:npm start



Usage

Access the frontend at http://localhost:3000
The backend API runs at http://localhost:5000 (or as configured)
Log in, upload or input data, and explore analytics and visualizations on the dashboard.

Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss proposed changes.
License
MIT License
Acknowledgements

Libraries: PyTorch, TensorFlow, React.js, spaCy, SymPy, and others


