import React, { useState } from "react";
import MapDisplay from "./components/MapDisplay";
import VideoRecorder from "./components/VideoRecorder";

const App = () => {
  const [recordings, setRecordings] = useState([]); // Define recordings and its setter

  const handleNewRecording = (newRecording) => {
    setRecordings((prev) => [
      ...prev,
      { ...newRecording, id: prev.length + 1 }, // Add unique ID
    ]);
  };

  return (
    <div>
      <VideoRecorder onRecordingComplete={handleNewRecording} />
      <MapDisplay recordings={recordings} setRecordings={setRecordings} /> {/* Pass setRecordings */}
    </div>
  );
};

export default App;
