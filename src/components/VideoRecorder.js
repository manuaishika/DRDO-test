import React, { useRef, useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const VideoRecorder = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("Ready to record");
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
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
        const videoBlob = new Blob(recordedChunks.current, { type: "video/webm" });
        const videoUrl = URL.createObjectURL(videoBlob);

        const position = await getCurrentLocation();
        if (!position) {
          alert("Failed to get location.");
          return;
        }

        const recordingTime = new Date().toLocaleString();
        onRecordingComplete({
          videoUrl,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          time: recordingTime,
        });

        setIsRecording(false);
        setStatus("Recording complete!");
      };
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Could not start recording. Please check camera and microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setStatus("Stopping recording...");
    }
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
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
      <Typography variant="body1" sx={{ marginTop: "10px" }}>
        {status}
      </Typography>
    </Box>
  );
};

export default VideoRecorder;
