import { useState, useEffect } from "react";

const api = {
  key: "4f5c49870811811bd9d1831089e32215",
  base: "https://api.openweathermap.org/data/2.5/",
};

function Weather() {
  const [weather, setWeather] = useState({});
  const [alert, setAlert] = useState(""); // State to hold disaster alerts

  useEffect(() => {
    // Get the user's current position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, []);

  const fetchWeather = (lat, lon) => {
    fetch(`${api.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${api.key}`)
      .then(res => res.json())
      .then(result => {
        setWeather(result);

        // Check for disaster alerts based on weather conditions
        const alerts = result.weather[0].main.toLowerCase();
        if (alerts === "storm" || alerts === "rain" || alerts === "snow") {
          setAlert("⚠️ Severe weather alert! Be cautious.");
        } else {
          setAlert("");
        }
      });
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        width: "240px", // Decreased width
        backgroundColor: "#e0e0e0", // Grey background
        padding: "15px", // Decreased padding
        borderRadius: "10px", // Slightly smaller border radius
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        zIndex: 1000,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        transition: "background-color 0.3s, transform 0.3s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#d0d0d0"; // Darker grey
        e.currentTarget.style.transform = "scale(1.02)"; // Slight zoom effect
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#e0e0e0"; // Reset background color
        e.currentTarget.style.transform = "scale(1)"; // Reset zoom effect
      }}
    >
      {alert && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "8px",
            borderRadius: "6px",
            marginBottom: "10px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          {alert}
        </div>
      )}
      {typeof weather.main !== "undefined" ? (
        <div style={{ color: "#333" }}>
          <p style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>{weather.name}</p>
          <p style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "4px" }}>{weather.main.temp}°C</p>
          <p style={{ fontSize: "14px", marginBottom: "4px" }}>{weather.weather[0].main}</p>
          <p style={{ fontSize: "12px", color: "#666" }}>{weather.weather[0].description}</p>
          <p style={{ fontSize: "14px", marginTop: "8px" }}>Humidity: {weather.main.humidity}%</p>
          <p style={{ fontSize: "14px" }}>Wind Speed: {weather.wind.speed} m/s</p>
        </div>
      ) : (
        <p style={{ color: "#999" }}>Fetching weather data...</p>
      )}
    </div>
  );
}

export default Weather;

