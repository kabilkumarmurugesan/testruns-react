import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputLabel from "@mui/material/InputLabel";
import { withCardLayout } from "../../components/auth";
import { useNavigate } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../../assets/styles/css/App.css";
import { ToastContainer, toast } from "react-toastify";

const regex = /^(0*[1-9][0-9]*(\.[0-9]*)?|0*\.[0-9]*[1-9][0-9]*)$/;
const validationSchema = Yup.object().shape({
  otp: Yup.string()
    .required("OTP is required")
    .min(4, "Invalid OTP!")
    .max(8, "Invalid OTP!")
    .matches(regex, "Invalid OTP!"),
});

const OTP = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const onSubmit = (values: any) => {
    const isMatch = checkCredentials(values.otp);

    if (isMatch) {
      toast(`OTP submitted successful !`, {
        style: {
          background: "#00bf70",
          color: "#fff",
        },
      });
    } else {
      formik.setFieldError("otp", "Invalid OTP");
    }
  };

  const checkCredentials = (otp: any) => {
    return true;
  };

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={false}
        hideProgressBar={true}
      />
      <Typography variant="h5" className="title-text">
        Enter OTP
      </Typography>
      <Box sx={{ pt: 3 }}>
        <Typography className="reg-text">
          We will send you an OTP on your registered email-ID.
        </Typography>
      </Box>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ mt: 4 }} className="auth-inner">
          <Box className="otp-input" style={{ position: "relative" }}>
            <InputLabel>Enter OTP</InputLabel>
            <TextField
              margin="normal"
              fullWidth
              inputProps={{ maxLength: 8 }}
              type={showPassword ? "text" : "password"}
              placeholder="OTP"
              name="otp"
              id="otp"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.otp}
              error={formik.touched.otp && Boolean(formik.errors.otp)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle otp visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      sx={{ mr: 0 }}
                    >
                      {!showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {formik.touched.otp && formik.errors.otp && (
              <Typography className="error-field">
                {formik.errors.otp}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography className="resend-otp">
              Resend OTP in <span>00:30</span>
            </Typography>
          </Box>
          <Box pt={4}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 0, mb: 0 }}
              className="signup-btn"
            >
              Verify
            </Button>
          </Box>
        </Box>
      </form>
      <Box sx={{ mt: 5 }}>
        <Typography className="read-text">
          Back to{" "}
          <span
            style={{ color: "#FF8400", cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            log in!
          </span>
        </Typography>
      </Box>
    </>
  );
};

const EnhancedOTPPage = withCardLayout(OTP);

export default EnhancedOTPPage;
