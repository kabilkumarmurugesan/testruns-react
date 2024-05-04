import React from "react";
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
// import io from "socket.io-client";

// const socket = io("http://localhost:5000");

export default function Billings() {
  const { data, loading, error }: any = useSelector((state) => state);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Box className="main-padding">
        <Box className="title-main">
          <Typography>Billing and Subscriptions</Typography>
        </Box>
      </Box>
    </>
  );
}
