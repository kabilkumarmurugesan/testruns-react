import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CircularProgress from "@mui/material/CircularProgress";
import InputLabel from "@mui/material/InputLabel";
import Checkbox from "@mui/material/Checkbox";
import { useFormik } from "formik";
import * as Yup from "yup";
import { withCardLayout } from "../../components/auth";
import "../../assets/styles/css/App.css";
import { ToastContainer, toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase.config";
import { useDispatch } from "react-redux";
import { fetchLoginUser, fetchSingleUserData } from "../../api/userAPI";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { FormControlLabel } from "@mui/material";

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email")
    .matches(emailRegex, "In-correct email"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Wrong password"),
});

const Login = () => {
  const navigate: any = useNavigate();
  if (typeof window !== "undefined") {
    isLoggedIn = localStorage.getItem("isLoggedIn");
  }
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const [loading, setLoading] = React.useState(false);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const dispatch: any = useDispatch();

  const onSubmit = (values: any) => {
    setLoading(true);
    const isMatch = checkCredentials(values.email, values.password);
    setIsSubmitted(true);
    if (isMatch) {
      if (typeof window !== "undefined") {
        signInWithEmailAndPassword(auth, values.email, values.password)
          .then((userCredential: any) => {
            // if(!userCredential.user.emailVerified){
            //   toast("Email is not verified!", {
            //     style: {
            //       background: 'red',
            //       color: '#fff',
            //     },
            //   });
            //   throw new Error("Email is not verified");

            // }
            const payload = {
              idToken: userCredential.user?.accessToken,
            };
            window.sessionStorage.setItem("accessToken", payload.idToken);
            dispatch(fetchLoginUser(payload))
              .then((res: any) => {
                const temp = { _id: res?.verifyToken?._id };
                dispatch(fetchSingleUserData(temp))
                  .then((isSuccess: any) => {
                    setLoading(false);
                    const data = isSuccess?.get_user ?? {};
                    if (data.status !== "Active") {
                      toast(`The user is inactive !`, {
                        style: {
                          background: "#d92828",
                          color: "#fff",
                        },
                      });
                      setIsSubmitted(isSubmitted);
                    } else {
                      window.localStorage.setItem("isLoggedIn", "true");
                      toast(`Welcome back! You've logged in successfully!`, {
                        style: {
                          background: "#00bf70",
                          color: "#fff",
                        },
                      });
                      navigate("/mypage");
                    }
                  })
                  .catch((error: any) => {
                    setLoading(false);
                    console.error(error);
                  });
              })
              .catch((error: any) => {
                setLoading(false);
                console.error(error);
              });
          })

          .catch((error) => {
            console.error(error.code);
            if (error.code === "auth/invalid-login-credentials") {
              toast(
                "Login attempt unsuccessful. Please check your username and password!",
                {
                  style: {
                    background: "red",
                    color: "#fff",
                  },
                }
              );
            } else {
              toast(
                error.code
                  .replace("auth/", "")
                  .replace("-", " ")
                  .replace("-", " ")
                  .charAt(0)
                  .toUpperCase() +
                  error.code
                    .replace("auth/", "")
                    .replace("-", " ")
                    .replace("-", " ")
                    .slice(1),
                {
                  style: {
                    background: "red",
                    color: "#fff",
                  },
                }
              );
            }
            setTimeout(() => {
              setLoading(false);
              setIsSubmitted(isSubmitted);
            }, 2000);
          });
      }
    }
  };

  const checkCredentials = (email: any, password: any) => {
    return true;
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });

  return (
    <>
      <Typography variant="h5" className="title-text">
        Log in to your Test Runs account
      </Typography>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={false}
        hideProgressBar={true}
      />
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ mt: 4 }} className="auth-inner">
          <Box style={{ position: "relative" }}>
            <InputLabel htmlFor="email"> E-mail </InputLabel>
            <TextField
              margin="normal"
              fullWidth
              name="email"
              id="email"
              inputProps={{ maxLength: 50 }}
              InputLabelProps={{ shrink: false }}
              placeholder="E-mail"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              error={formik.touched.email && Boolean(formik.errors.email)}
            />
            {formik.touched.email && formik.errors.email && (
              <Typography className="error-field">
                {formik.errors.email}
              </Typography>
            )}
          </Box>

          <Box style={{ position: "relative" }}>
            <InputLabel htmlFor="password">Password</InputLabel>
            <TextField
              type={showPassword ? "text" : "password"}
              fullWidth
              autoComplete="off"
              inputProps={{ maxLength: 24 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
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
              name="password"
              id="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              variant="outlined"
              error={formik.touched.password && Boolean(formik.errors.password)}
              placeholder="Password"
            />
            {formik.touched.password && formik.errors.password && (
              <Typography className="error-field">
                {formik.errors.password}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              display: { xs: "block", sm: "flex" },
              alignItems: "center",
              bottom: "20px",
              position: "relative",
              justifyContent: "space-between",
              textAlign: "center",
            }}
          >
            <Box sx={{ paddingLeft: "8px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    value="remember"
                    color="primary"
                    sx={{
                      color: "#9F9F9F",
                      "&.Mui-checked": {
                        color: "#FFC60B",
                      },
                    }}
                  />
                }
                label="Remember me"
                className="remember-me"
                style={{ marginBottom: "0rem" }}
              />
            </Box>
            <Box sx={{ marginTop: { xs: "1rem", sm: "0rem" } }}>
              <Typography
                className="forgot-pass"
                onClick={() => navigate("/forgot-password")}
              >
                Forget your password?
              </Typography>
            </Box>
          </Box>

          <Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 0,
                mb: 0,
                // background: "#FFC60B",
              }}
              className="signup-btn"
              disabled={loading}
            >
              {!loading ? (
                "Log in"
              ) : (
                <CircularProgress color="warning" size={30} />
              )}
            </Button>
          </Box>
        </Box>
      </form>
      <Box sx={{ marginTop: { xs: "1rem", sm: "2rem" } }}>
        <Typography className="forgot-pass1">version 2. 6. 7</Typography>
      </Box>

      <Box sx={{ mt: "2rem" }}>
        <Typography className="read-text">
          Don't have an account yet?{" "}
          <span
            style={{ color: "#FF8400", cursor: "pointer" }}
            onClick={() => navigate("/signup")}
          >
            Click here to Sign up!
          </span>
        </Typography>
      </Box>
    </>
  );
};
const EnhancedLoginPage = withCardLayout(Login);

export default EnhancedLoginPage;
