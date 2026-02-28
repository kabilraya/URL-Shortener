import React, { useEffect } from "react";
import "./Homepage.scss";
import { useState } from "react";
import TimerOffOutlinedIcon from "@mui/icons-material/TimerOffOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import axios from "axios";
export default function Homepage() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [retryTime, setRetryTime] = useState(0);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/shorten", {
        url,
      });

      setAlias(response.data.short_url);
      setShowSuccess(true);
      setShowError(false);
    } catch (err) {
      if (err.response) {
        setRetryTime(err.response.data.detail.retry_after);
        setShowError(true);
        setShowSuccess(false);
      }
    }
  };

  //for the timer decreament
  useEffect(() => {
    if (retryTime > 0) {
      const timer = setInterval(() => {
        setRetryTime((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [retryTime]);
  return (
    <div className="Homepage">
      <div className="home-div">
        <div className="header">
          <h1>Shorten Your Links</h1>
          <div className="spanned">
            <span>
              Shorten-URL is the most minimalist and powerful URL shortener for
              creators.
            </span>
            <span>
              Transform your long, complex URLs into clean, manageable links.
            </span>
          </div>
        </div>
        <div className="main">
          <form onSubmit={handleSubmit}>
            <div className="fields">
              <label>Enter your URL</label>
              <input
                type="text"
                placeholder="Enter your long URL here"
                name="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              ></input>
            </div>
            <button type="submit">Shorten URL</button>
          </form>
        </div>
        {showSuccess && (
          <div className="output">
            <div className="top">
              <CheckCircleOutlinedIcon
                className="icon-success"
                fontSize="medium"
              ></CheckCircleOutlinedIcon>
              <span>Success! Your link is ready</span>
            </div>
            <div className="bottom">
              <span
                style={{ cursor: "pointer" }}
                onClick={() =>
                  (window.location.href = `http://localhost:8000/${alias}`)
                }
              >
                {alias}
              </span>
            </div>
          </div>
        )}
        {showError && (
          <div className="error">
            <div className="top">
              <div className="icon-wrapper">
                <TimerOffOutlinedIcon
                  className="timer"
                  fontSize="large"
                ></TimerOffOutlinedIcon>
              </div>

              <div className="error-message">
                <span>Too Many Request (429)</span>
                <p>
                  You've reached your hourly limit. Please wait before
                  shortening more links.
                </p>
              </div>
            </div>
            <div className="bottom">
              <span>{retryTime}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
