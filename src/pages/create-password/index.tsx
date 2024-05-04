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
import { useFormik } from "formik";
import * as Yup from "yup";
import "../../assets/styles/css/App.css";
import { ToastContainer, toast } from "react-toastify";
import { updatePassword } from "firebase/auth";
import { auth } from "../../firebase.config";
import { useNavigate } from "react-router";

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const validationSchema = Yup.object().shape({
  // email: Yup.string().required("Email is required").email("Invalid email").matches(emailRegex, "In-correct email"),
  password: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Weak password"
    ),
  confirm_password: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password"), ""], "Password mismatch"),
});

const ResetPassword = () => {
  const navigate = useNavigate();
  interface FormValidation {
    newpassword: boolean;
    confirmpassword: boolean;
  }

  const [initalStatus, setInitalStatus] = React.useState<FormValidation>({
    newpassword: false,
    confirmpassword: false,
  });

  const handleClickShowPassword = (
    key: keyof FormValidation,
    newValue: boolean
  ) => {
    const updatedValidation = { ...initalStatus };
    updatedValidation[key] = newValue;
    setInitalStatus(updatedValidation);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const onSubmit = (values: any) => {
    const isMatch = checkCredentials(
      // values.email,
      values.password,
      values.confirm_password
    );
    const user = auth.currentUser;
    if (isMatch) {
      updatePassword(user, values.confirm_password)
        .then((res) => {
          // Update successful.
          toast(`Password created successful !`, {
            style: {
              background: "#00bf70",
              color: "#fff",
            },
          });
          setTimeout(() => {
            navigate("/mypage");
          }, 2000);
        })
        .catch((error) => {
          console.error(error);

          // An error ocurred
          // ...
        });
      // toast(`Password Reset successful !`, {
      //   style: {
      //     background: '#00bf70', color: '#fff'
      //   }
      // });
      // setTimeout(()=>{
      //   navigate('/login')
      // },2000)
      // alert("Reset successful!");
      // navigate('/login')
    } else {
      formik.setFieldError("email", "Invalid email");
      formik.setFieldError("password", "Invalid password");
      formik.setFieldError("confirm_password", "Invalid confirm password");
    }
  };

  const checkCredentials = (password: any, confirm_password: any) => {
    if (password !== "" && confirm_password !== "") {
      return true;
    } else {
      return false;
    }
  };

  const formik = useFormik({
    initialValues: {
      // email: "",
      password: "",
      confirm_password: "",
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
        Create Password
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ mt: 4 }} className="auth-inner">
          <Box style={{ position: "relative" }}>
            <InputLabel>New password</InputLabel>
            <TextField
              type={initalStatus.newpassword ? "text" : "password"}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={(e) =>
                        handleClickShowPassword(
                          "newpassword",
                          !initalStatus.newpassword
                        )
                      }
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      sx={{ mr: 0 }}
                    >
                      {!initalStatus.newpassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              inputProps={{ maxLength: 24 }}
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
            {formik.touched.password && !formik.errors.password && (
              <Typography className="valid-field">Strong password</Typography>
            )}
          </Box>
          <Box style={{ position: "relative" }}>
            <InputLabel>Confirm password</InputLabel>
            <TextField
              type={initalStatus.confirmpassword ? "text" : "password"}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={(e) =>
                        handleClickShowPassword(
                          "confirmpassword",
                          !initalStatus.confirmpassword
                        )
                      }
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      sx={{ mr: 0 }}
                    >
                      {!initalStatus.confirmpassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              name="confirm_password"
              id="confirm_password"
              onPaste={(event) => {
                event.preventDefault();
              }}
              onChange={formik.handleChange}
              style={{ userSelect: "none" }}
              onBlur={formik.handleBlur}
              value={formik.values.confirm_password}
              variant="outlined"
              error={
                formik.touched.confirm_password &&
                Boolean(formik.errors.confirm_password)
              }
              placeholder="Confirm Password"
            />
            {formik.touched.confirm_password &&
              formik.errors.confirm_password && (
                <Typography className="error-field">
                  {formik.errors.confirm_password}
                </Typography>
              )}
            {formik.touched.confirm_password &&
              !formik.errors.confirm_password && (
                <Typography className="valid-field">
                  Password matched
                </Typography>
              )}
          </Box>
          <Box pt={2}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 0, mb: 0 }}
              className="signup-btn"
            >
              Submit
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

const EnhancedResetPage = withCardLayout(ResetPassword);

export default EnhancedResetPage;
