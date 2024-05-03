import React from 'react';
import PrivateRoute from '../../components/PrivateRoute';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// import { fetchAssetsData } from "../../api/assetsAPI";
// import io from "socket.io-client";

// const socket = io("http://localhost:5000");

export default function Billings() {
  const dispatch: any = useDispatch();
  const { data, loading, error }: any = useSelector((state) => state);
  // const [messages, setMessages] = React.useState<any>([]);

  React.useEffect(() => {
    // dispatch(
    //   fetchAssetsData({
    //     productId: 1,
    //   })
    // );
  }, []);

  // React.useEffect(() => {
  //   socket.on("message", (data) => {
  //     setMessages([...messages, data]);
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [messages]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <PrivateRoute>
      <Box className="main-padding">
        <Box className="title-main">
          <Typography>Billing and Subscriptions</Typography>
        </Box>
      </Box>
    </PrivateRoute>
  );
}
