import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
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
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../../firebase.config";
import { postUserData } from "../../api/userAPI";
import { useDispatch } from "react-redux";
import moment from "moment";
import { useNavigate } from "react-router";

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email")
    .matches(emailRegex, "In-correct email"),
  password: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Weak password"
    ),
  confirm_password: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password"), ""], "Password mismatch"),
  termsAndConditions: Yup.bool().oneOf(
    [true],
    "You need to accept the terms and conditions"
  ),
  // agree: Yup.boolean()
  //   .required('You must accept the Terms of Service to proceed')
  // .oneOf([true], 'Error')
});

const SignUp = () => {
  const navigate = useNavigate();
  interface FormValidation {
    password: boolean;
    confirmpassword: boolean;
  }

  const [initalStatus, setInitalStatus] = React.useState<FormValidation>({
    password: false,
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

  const dispatch: any = useDispatch();

  const onSubmit = (values: any) => {
    const isMatch = checkCredentials(
      values.firstName,
      values.lastName,
      values.email.toLowerCase(),
      values.password,
      values.confirm_password,
      values.termsAndConditions
    );

    if (isMatch) {
      try {
        values.email.toLowerCase(),
          createUserWithEmailAndPassword(
            auth,
            values.email.toLowerCase(),
            values.password
          )
            .then((res: any) => {
              const user = res; // Get the user object
              sendEmailVerification(auth.currentUser)
                .then(() => {
                  let payload = {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    fullName: `${values.firstName} ${values.lastName}`,
                    email: values.email.toLowerCase(),
                    uid: user.uid,
                    // organisationId: process.env.ORGANIZATION_ID,
                    // role: process.env.ROLE_ID,
                    // phoneNumber:'9876543210',
                    // departmentId: [process.env.DEPARTMENT_ID],
                    // laboratoryId: [process.env.LABORATORY_ID],
                    // instituteId: process.env.INSTITUTION_ID,
                    createdOn: moment(new Date()).format("MM/DD/YYYY"),
                    // createdBy: 'Self',
                  };
                  window.sessionStorage.setItem(
                    "accessToken",
                    res.user?.accessToken
                  );

                  dispatch(postUserData(payload))
                    .then((res: any) => {
                      toast(
                        `Welcome to Testruns! You've signed up successfully! Please verify your email.`,
                        {
                          style: {
                            background: "#00bf70",
                            color: "#fff",
                          },
                        }
                      );
                      // toast(res.create_user.message, {
                      //   style: {
                      //     background: '#00bf70',
                      //     color: '#fff',
                      //   },
                      // });
                      setTimeout(() => {
                        navigate("/login");
                      }, 1000);
                    })
                    .catch((error: any) => {
                      console.error(error);
                      toast(`Something went wrong!`, {
                        style: {
                          background: "#d92828",
                          color: "#fff",
                        },
                      });
                    });
                })
                .catch((error) => {
                  console.error(error);
                  toast(`Error sending verification email!`, {
                    style: {
                      background: "#d92828",
                      color: "#fff",
                    },
                  });
                });
            })
            .catch((error) => {
              console.error("emailerror", error);
              toast(`Email already Exists !`, {
                style: {
                  background: "#d92828",
                  color: "#fff",
                },
              });
            });
      } catch (error) {
        console.error("Email", error);
        toast(`Email already Exists !`, {
          style: {
            background: "#d92828",
            color: "#fff",
          },
        });
      }
    } else {
      formik.setFieldError("firstName", "Invalid First name");
      formik.setFieldError("lastName", "Invalid Last name");
      formik.setFieldError("email", "Invalid email");
      formik.setFieldError("password", "Invalid password");
      formik.setFieldError("confirm_password", "Invalid confirm password");
    }
  };

  const checkCredentials = (
    firstName: any,
    lastName: any,
    email: any,
    password: any,
    confirm_password: any,
    termsAndConditions: boolean
  ) => {
    if (
      firstName !== "" &&
      lastName !== "" &&
      email !== "" &&
      password !== "" &&
      confirm_password !== "" &&
      termsAndConditions === true
    ) {
      return true;
    } else {
      return false;
    }
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirm_password: "",
      termsAndConditions: false,
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
        Sign up for a <span>free</span> Test Runs account
      </Typography>
      <form onSubmit={formik.handleSubmit} autoComplete="off">
        <Box sx={{ mt: 4 }} className="auth-inner">
          <Box style={{ position: "relative" }}>
            <InputLabel>First name</InputLabel>
            <TextField
              margin="normal"
              fullWidth
              name="firstName"
              id="firstName"
              InputLabelProps={{ shrink: false }}
              placeholder="First name"
              inputProps={{ maxLength: 50 }}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.firstName}
              error={
                formik.touched.firstName && Boolean(formik.errors.firstName)
              }
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <Typography className="error-field">
                {formik.errors.firstName}
              </Typography>
            )}
          </Box>
          <Box style={{ position: "relative" }}>
            <InputLabel>Last name</InputLabel>
            <TextField
              margin="normal"
              fullWidth
              name="lastName"
              id="lastName"
              InputLabelProps={{ shrink: false }}
              placeholder="Last name"
              inputProps={{ maxLength: 50 }}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.lastName}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <Typography className="error-field">
                {formik.errors.lastName}
              </Typography>
            )}
          </Box>
          <Box style={{ position: "relative" }}>
            <InputLabel>E-mail</InputLabel>
            <TextField
              autoComplete="off"
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
            <InputLabel>Password</InputLabel>
            <TextField
              autoComplete="off"
              type={initalStatus.password ? "text" : "password"}
              fullWidth
              inputProps={{ maxLength: 24 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={(e) =>
                        handleClickShowPassword(
                          "password",
                          !initalStatus.password
                        )
                      }
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      sx={{ mr: 0 }}
                    >
                      {!initalStatus.password ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
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
            {formik.touched.password && !formik.errors.password && (
              <Typography className="valid-field">Strong strength</Typography>
            )}
          </Box>
          <Box style={{ position: "relative" }}>
            <InputLabel>Confirm password</InputLabel>
            <TextField
              type={initalStatus.confirmpassword ? "text" : "password"}
              fullWidth
              name="confirm_password"
              onPaste={(event) => {
                event.preventDefault();
              }}
              id="confirm_password"
              inputProps={{ maxLength: 24 }}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirm_password}
              variant="outlined"
              style={{ userSelect: "none" }}
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
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              mt: -2,
              paddingLeft: "8px",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  inputProps={{ autoComplete: "off" }} // Add autoComplete="off" for the Checkbox
                  checked={formik.values.termsAndConditions}
                  onChange={formik.handleChange}
                  name="termsAndConditions"
                  color="primary"
                  sx={{
                    color: "#9F9F9F",
                    "&.Mui-checked": {
                      color: "#FFC60B",
                    },
                  }}
                />
              }
              className="remember-me"
              label={undefined}
            />
            <Typography className="read-text">
              I have read and understood and agree with terms of service and
              Privacy policy of Test Runs.{" "}
              <span style={{ cursor: "pointer" }}>[Read more]</span>
            </Typography>
          </Box>
          {formik.touched.termsAndConditions &&
            formik.errors.termsAndConditions && (
              <Typography className="error-field-checkbox">
                {formik.errors.termsAndConditions}
              </Typography>
            )}
          {/* {errors.termsAndConditions && <p>{errors.termsAndConditions}</p>} */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            // disableFocusRipple
            disabled={!formik.isValid}
            sx={{ mt: 3, mb: 2 }}
            className="signup-btn"
          >
            Signup for free
          </Button>
        </Box>
      </form>
      <Box>
        <Typography className="read-text">
          Already have an account?{" "}
          <span
            style={{ color: "#FF8400", cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Click here to log in.
          </span>
        </Typography>
      </Box>
    </>
  );
};

const EnhancedSignUpPage = withCardLayout(SignUp);

export default EnhancedSignUpPage;
