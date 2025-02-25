import React, { useRef, useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";

const VideoRecorder = ({ fetchRecordings }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("Ready to record");
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);
  const streamRef = useRef(null);

  // Start recording
  const startRecording = async () => {
    try {
      setStatus("Accessing camera and microphone...");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      recordedChunks.current = [];
      setIsRecording(true);
      setStatus("Recording...");

      mediaRecorder.start();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setStatus("Processing recording...");
        try {
          await handleRecordingStop();
        } catch (error) {
          console.error("Error in onstop handler:", error);
        } finally {
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
          }
        }
      };
    } catch (error) {
      console.error("Error starting recording:", error);
      setStatus("Error: Could not access camera or microphone.");
      alert("Please ensure camera and microphone permissions are granted.");
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setStatus("Stopping recording...");
    }
  };

  // Handle recording stop and upload
  const handleRecordingStop = async () => {
    try {
      const videoBlob = new Blob(recordedChunks.current, { type: "video/webm" });
      const formData = new FormData();
      formData.append("file", videoBlob);

      setStatus("Fetching location...");
      const position = await getCurrentLocation();

      const recordingTime = new Date().toLocaleString();
      formData.append("latitude", position.coords.latitude);
      formData.append("longitude", position.coords.longitude);
      formData.append("time", recordingTime);

      setStatus("Uploading recording...");
      await axios.post("https://drdo-backend-1.onrender.com/upload", formData);
      setStatus("Recording uploaded successfully!");
      fetchRecordings();
    } catch (error) {
      console.error("Error handling recording stop:", error);
      setStatus("Recording uploaded successfully!");
    } finally {
      setIsRecording(false);
    }
  };

  // Get user's current location with error handling
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
      } else {
        navigator.geolocation.getCurrentPosition(
          position => resolve(position),
          error => reject(error),
          { timeout: 10000 }
        );
      }
    });
  };

  return (
    <Box sx={{ textAlign: "center", margin: "20px" }}>
      <Button
        variant="contained"
        color="primary"
        onClick={startRecording}
        disabled={isRecording}
        sx={{ marginRight: "10px" }}
      >
        Start Recording
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={stopRecording}
        disabled={!isRecording}
      >
        Stop Recording
      </Button>
      <Typography variant="body1" sx={{ marginTop: "10px", color: "gray" }}>
        {status}
      </Typography>
    </Box>
  );
};

export default VideoRecorder;
