import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/Login";
import DataParser from "./components/DataParser";
import SentimentAnalysis from "./components/SentimentAnalysis";
import NetworkAnalysis from "./components/NetworkAnalysis";
import Report from "./components/Report";
import AnalysisResults from "./components/AnalysisResults";
import DataInputForm from "./components/DataInputForm";
import { useState, useEffect } from "react";
import "./App.css";
import { Link } from "react-router-dom";
import logo from './assets/bluewatch-logo.png';
import Dashboard from './components/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setShowForm(false);
    try {
      // In a real app, you would send formData to the backend
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setAnalysisData(data);
    } catch (error) {
      console.error('Error fetching analysis data:', error);
      // Fallback to mock data for demo
      const response = await fetch('http://localhost:5000/analyze');
      const data = await response.json();
      setAnalysisData(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/analyze');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      }
    };

    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className="container">
        <Routes>
          {/* Login Route - Accessible to everyone */}
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />

          {/* Protected Routes - Only accessible if logged in */}
          <Route
            path="/data-parser"
            element={
              isLoggedIn ? (
                loading ? (
                  <div className="loading">LOADING ANALYSIS DATA...</div>
                ) : showForm ? (
                  <DataInputForm onSubmit={handleFormSubmit} />
                ) : analysisData ? (
                  <Dashboard data={analysisData} />
                ) : (
                  <div className="error">Failed to load analysis data</div>
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/sentiment-analysis"
            element={isLoggedIn ? <SentimentAnalysis /> : <Navigate to="/login" />}
          />
          <Route
            path="/network-analysis"
            element={isLoggedIn ? <NetworkAnalysis /> : <Navigate to="/login" />}
          />
          <Route
            path="/reports"
            element={isLoggedIn ? <Report /> : <Navigate to="/login" />}
          />

          {/* Default Route - Minimal initial page */}
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          {/* Catch all other routes */}
          <Route
            path="*"
            element={<Navigate to="/" />}
          />
        </Routes>
      </div>
      
    </Router>
  );
}


export default App;