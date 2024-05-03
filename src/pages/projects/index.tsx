import React from "react";
import PrivateRoute from "../../components/PrivateRoute";
import { Box, Typography } from "@mui/material";

export default function Projects() {
  return (
    <PrivateRoute>
      {" "}
      <Box className="main-padding">
      <Box className="title-main">
    <iframe
        title="testing"
        id="chartID"
        className="iframe full-height"
        src="https://appmicroapp-tfb5ibk7msl7ezgv9bfudr.streamlit.app/?embed=true"
        frameBorder="0"
        name="testingView"
        allowFullScreen // Add allowfullscreen attribute
        style={{ width: '100%', height: '100vh', border: 'none' }} // Set width and height to 100% and remove border
    />
</Box>
      </Box>
    </PrivateRoute>
  );
}
