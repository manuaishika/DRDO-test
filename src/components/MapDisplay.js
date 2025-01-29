import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow, HeatmapLayer } from "@react-google-maps/api";
import axios from "axios";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const MapDisplay = () => {
  const [recordings, setRecordings] = useState([]);
  const [selectedRecording, setSelectedRecording] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const [mapType, setMapType] = useState("roadmap");
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [googleInstance, setGoogleInstance] = useState(null); // Store the Google Maps API instance

  const mapContainerStyle = {
    width: "100%",
    height: "500px",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
  };

  const newDelhiCenter = { lat: 28.6139, lng: 77.209 };

  // Fetch recordings from the backend
  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const response = await axios.get("http://localhost:8000/recordings");
        setRecordings(response.data);
      } catch (error) {
        console.error("Error fetching recordings:", error);
      }
    };

    fetchRecordings();
  }, []);

  const handleRecenterToNewDelhi = () => {
    if (mapRef) {
      mapRef.panTo(newDelhiCenter);
      mapRef.setZoom(10);
    }
  };

  const handleRecenterToFirstMarker = () => {
    if (mapRef && recordings.length > 0) {
      const { latitude, longitude } = recordings[0];
      mapRef.panTo({ lat: latitude, lng: longitude });
      mapRef.setZoom(10);
    }
  };

  const toggleMapType = () => {
    setMapType((prevType) => (prevType === "roadmap" ? "satellite" : "roadmap"));
  };

  const toggleHeatmap = () => {
    setShowHeatmap((prev) => !prev);
  };

  // Generate heatmap data based on fetched locations
  const heatmapData =
    googleInstance &&
    recordings.length > 0 &&
    recordings.map(
      (rec) =>
        new googleInstance.maps.LatLng(rec.latitude, rec.longitude) // Create LatLng objects
    );

  return (
    <Box sx={{ marginTop: "20px", padding: "20px" }}>
      <Typography variant="h6" sx={{ marginBottom: "10px" }}>
        Recorded Locations
      </Typography>
      <Box sx={{ marginBottom: "10px", textAlign: "right" }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleRecenterToNewDelhi}
          sx={{ marginRight: "10px" }}
        >
          Recenter to New Delhi
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleRecenterToFirstMarker}
          disabled={recordings.length === 0}
          sx={{ marginRight: "10px" }}
        >
          Recenter to First Marker
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={toggleMapType}
          sx={{ marginRight: "10px" }}
        >
          Switch to {mapType === "roadmap" ? "Satellite View" : "Map View"}
        </Button>
        <Button variant="contained" color="secondary" onClick={toggleHeatmap}>
          {showHeatmap ? "Hide Heatmap" : "Show Heatmap"}
        </Button>
      </Box>
      <LoadScript
        googleMapsApiKey="AIzaSyAxEYPIcz4RCV2q6VC3JbMmTQahq9yVaG4"
        libraries={["visualization"]} // Add visualization library for HeatmapLayer
        onLoad={(google) => setGoogleInstance(google)}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={
            recordings.length > 0
              ? { lat: recordings[0].latitude, lng: recordings[0].longitude }
              : newDelhiCenter
          }
          zoom={10}
          onLoad={(map) => setMapRef(map)}
          mapTypeId={mapType}
        >
          {showHeatmap && heatmapData && (
            <HeatmapLayer
              data={heatmapData}
              options={{
                radius: 20, // Radius of the heatmap points
                opacity: 0.7, // Transparency of the heatmap
              }}
            />
          )}
          {recordings.map((rec) => (
            <Marker
              key={rec._id}
              position={{ lat: rec.latitude, lng: rec.longitude }}
              onClick={() => setSelectedRecording(rec)}
            />
          ))}
          {selectedRecording && (
            <InfoWindow
              position={{
                lat: selectedRecording.latitude,
                lng: selectedRecording.longitude,
              }}
              onCloseClick={() => setSelectedRecording(null)}
            >
              <Box>
                <Typography variant="subtitle1" sx={{ marginBottom: "10px" }}>
                  Recording Details
                </Typography>
                <Typography variant="body2" sx={{ marginBottom: "10px" }}>
                  <strong>Time:</strong> {selectedRecording.time}
                </Typography>
                <video
                  src={selectedRecording.videoUrl}
                  controls
                  style={{ width: "100%", borderRadius: "8px", marginBottom: "10px" }}
                />
                <Link
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedRecording.latitude},${selectedRecording.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ display: "block", marginBottom: "10px" }}
                >
                  Get Directions in Google Maps
                </Link>
              </Box>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </Box>
  );
};

export default MapDisplay;
