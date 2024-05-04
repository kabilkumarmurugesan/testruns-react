import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import google from "../../assets/images/common/google.svg";
import microsoft from "../../assets/images/common/micro.svg";
import authbg from "../../assets/images/auth-bg.svg";
import { Link } from "@mui/material";
import { auth, provider } from "../../firebase.config";
import { getAdditionalUserInfo, signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import {
  fetchLoginUser,
  fetchSingleUserData,
  postUserData,
} from "../../api/userAPI";
import { useDispatch } from "react-redux";
import moment from "moment";
import { useNavigate } from "react-router";

export const CardLayout = ({ children }: any, props: any) => {
  const [answer, setAnswer] = React.useState<any>(10);
  const navigate: any = useNavigate();
  const Placeholder = ({ children }: any) => {
    return <div>{children}</div>;
  };

  const dispatch: any = useDispatch();

  const googleSignup = async (socailType: any) => {
    try {
      const googleProvider = provider("google.com");
      const result: any = await signInWithPopup(auth, googleProvider);
      const additionalUserInfo: any = getAdditionalUserInfo(result);
      const userDetails = result.user;
      let payload = {
        firstName:
          userDetails.displayName !== null
            ? userDetails.displayName
            : userDetails.email.split("@")[0].includes(".")
            ? userDetails.email.split("@")[0].split(".")[0]
            : userDetails.email.split("@")[0],
        lastName: "",
        fullName: `${
          userDetails.displayName !== null
            ? userDetails.displayName
            : userDetails.email.split("@")[0].includes(".")
            ? userDetails.email.split("@")[0].split(".")[0]
            : userDetails.email.split("@")[0]
        } ${""}`,
        email: userDetails.email,
        uid: userDetails.uid,
        // organisationId: process.env.ORGANIZATION_ID,
        // role: process.env.ROLE_ID,
        // departmentId: [process.env.DEPARTMENT_ID],
        // laboratoryId: [process.env.LABORATORY_ID],
        // instituteId: process.env.INSTITUTION_ID,
        createdOn: moment(new Date()).format("MM/DD/YYYY"),
        // createdBy: 'Self',
      };
      let payload2 = {
        idToken: userDetails?.accessToken,
      };
      window.sessionStorage.setItem("accessToken", payload2.idToken);
      // if (userDetails.reloadUserInfo.lastLoginAt === undefined) {
      if (additionalUserInfo?.isNewUser) {
        await dispatch(postUserData(payload));
      }

      await dispatch(fetchLoginUser(payload2)).then((res: any) => {
        const temp = { _id: res?.verifyToken?._id };

        dispatch(fetchSingleUserData(temp)).then((isSuccess: any) => {
          const data = isSuccess?.get_user ?? {};

          if (data.status !== "Active") {
            toast(`The user is inactive !`, {
              style: {
                background: "#d92828",
                color: "#fff",
              },
            });
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          } else {
            window.localStorage.setItem("isLoggedIn", "true");
            toast(
              `${
                socailType === "signUp"
                  ? "Signup with Google completed successfully!"
                  : "You've successfully logged in with Google!"
              }`,
              {
                style: {
                  background: "#00bf70",
                  color: "#fff",
                },
              }
            );
            // if (result?.user?.reloadUserInfo.hasOwnProperty('passwordHash')) {
            setTimeout(() => {
              navigate("/mypage");
            }, 2000);
            // } else {
            //   setTimeout(() => {
            //     navigate('/create-password');
            // }, 2000);
            // }
          }
        });
      });
    } catch (error: any) {
      console.error(error);
      toast(
        error?.code
          .replace("auth/", "")
          .replace("-", " ")
          .replace("-", " ")
          .charAt(0)
          .toUpperCase() +
          error?.code
            .replace("auth/", "")
            .replace("-", " ")
            .replace("-", " ")
            .slice(1),
        {
          style: {
            background: "#d92828",
            color: "#fff",
          },
        }
      );
    }
  };
  const microsoftSignup = async (socailType: any) => {
    try {
      const microsoftProvider = provider("microsoft.com");
      const result: any = await signInWithPopup(auth, microsoftProvider);
      const additionalUserInfo: any = getAdditionalUserInfo(result);
      const userDetails = result.user;

      const payload = {
        firstName: userDetails.displayName,
        lastName: "",
        fullName: `${userDetails.displayName} ${""}`,
        email: userDetails.email,
        uid: userDetails.uid,
        // organisationId: process.env.ORGANIZATION_ID,
        // role: process.env.ROLE_ID,
        // departmentId: [process.env.DEPARTMENT_ID],
        // laboratoryId: [process.env.LABORATORY_ID],
        // instituteId: process.env.INSTITUTION_ID,
        createdOn: moment(new Date()).format("MM/DD/YYYY"),
        // createdBy: 'Self',
      };
      let payload2 = {
        idToken: userDetails?.accessToken,
      };
      window.sessionStorage.setItem("accessToken", payload2.idToken);
      if (additionalUserInfo?.isNewUser) {
        if (userDetails.reloadUserInfo.lastLoginAt === undefined) {
          await dispatch(postUserData(payload));
        }
      }

      await dispatch(fetchLoginUser(payload2)).then((res: any) => {
        const temp = { _id: res?.verifyToken?._id };
        dispatch(fetchSingleUserData(temp)).then((isSuccess: any) => {
          const data = isSuccess?.get_user ?? {};
          if (data.status !== "Active") {
            toast(`The user is inactive !`, {
              style: {
                background: "#d92828",
                color: "#fff",
              },
            });
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          } else {
            window.localStorage.setItem("isLoggedIn", "true");
            toast(
              `${
                socailType === "SignUp"
                  ? "Signup with Microsoft completed successfully!"
                  : "You've successfully logged in with Microsoft!"
              }`,
              {
                style: {
                  background: "#00bf70",
                  color: "#fff",
                },
              }
            );
            // if (result?.user?.reloadUserInfo.hasOwnProperty('passwordHash')) {
            setTimeout(() => {
              navigate("/mypage");
            }, 2000);
            // } else {
            //   setTimeout(() => {
            //     navigate('/create-password');
            //   }, 2000);
            // }
          }
        });
      });
    } catch (error: any) {
      console.error(error);
      toast(
        error?.code
          .replace("auth/", "")
          .replace("-", " ")
          .replace("-", " ")
          .charAt(0)
          .toUpperCase() +
          error?.code
            .replace("auth/", "")
            .replace("-", " ")
            .replace("-", " ")
            .slice(1),
        {
          style: {
            background: "#d92828",
            color: "#fff",
          },
        }
      );
    }
  };

  return (
    <>
      <Box
        className="main-center"
        style={{
          height: "100vh",
          backgroundImage: `url(${authbg})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          boxShadow: "0px 0px 0px 0px #ffffff",
        }}
      >
        <Grid
          container
          className="main-center-inner"
          style={{
            boxShadow: "0px 4px 10px 0px #0000001A",
            borderRadius: "10px",
          }}
        >
          <Grid item xs={12} sm={12} md={6} lg={6} className="sign-left">
            <Box>
              <Typography className="welcome-to">Welcome to</Typography>
              <Typography className="test-runz">Test Runs</Typography>
            </Box>
            {(children.props.uri === "/login" ||
              children.props.uri == "/") && (
              <Box className="login-center">
                <Typography className="sign-via">Sign In via</Typography>
                <Box className="sign-via-btn">
                  <Button
                    variant="contained"
                    style={{
                      fontWeight: 600,
                      color: "#181818",
                      fontSize: "15px",
                      textTransform: "none",
                    }}
                    onClick={() => googleSignup("SignIn")}
                  >
                    {" "}
                    <img src={google} alt="google" />
                    Sign In with Google
                  </Button>

                  <Button
                    variant="contained"
                    style={{
                      fontWeight: 600,
                      color: "#181818",
                      fontSize: "15px",
                      textTransform: "none",
                    }}
                    onClick={() => microsoftSignup("SignIn")}
                  >
                    {" "}
                    <img src={microsoft} alt="microsoft" />
                    Sign In with Microsoft
                  </Button>
                </Box>
              </Box>
            )}
            {children.props.uri === "/signup" && (
              <Box>
                <Typography className="sign-via">Sign up via</Typography>
                <Box className="sign-via-btn">
                  <Button
                    variant="contained"
                    style={{
                      fontWeight: 600,
                      color: "#181818",
                      fontSize: "15px",
                      textTransform: "none",
                    }}
                    onClick={() => googleSignup("SignUp")}
                  >
                    {" "}
                    <img src={google} alt="google" />
                    Sign up with Google
                  </Button>
                  <Button
                    variant="contained"
                    style={{
                      fontWeight: 600,
                      color: "#181818",
                      fontSize: "15px",
                      textTransform: "none",
                    }}
                    onClick={() => microsoftSignup("SignUp")}
                  >
                    {" "}
                    <img src={microsoft} alt="microsoft" />
                    Sign up with Microsoft
                  </Button>
                </Box>
              </Box>
            )}
            <Box>
              {children.props.uri === "/forgot-password" && (
                <Box className="auth-inner-text">
                  <Box>
                    <Typography variant="h5">Forgot your password?</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4">Don't worry we got you</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h1">Covered</Typography>
                  </Box>
                </Box>
              )}
              {children.props.uri === "/create-password" && (
                <Box className="auth-inner-text">
                  <Box>
                    <Typography variant="h5">Create your password</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4">Don't worry we got you</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h1">Covered</Typography>
                  </Box>
                </Box>
              )}
              {children.props.uri === "/otp" && (
                <Box className="auth-inner-text">
                  <Box>
                    <Typography variant="h5">Forgot your password?</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4">Don't worry we got you</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h1">Covered</Typography>
                  </Box>
                </Box>
              )}
              <Box className="country-term-section">
                <Box className="country-section">
                  <InfoOutlinedIcon sx={{ color: "#565656", mr: 2 }} />
                  <FormControl variant="standard">
                    <Select
                      MenuProps={{
                        disableScrollLock: true,
                        marginThreshold: null,
                      }}
                      labelId="country-list-select-label"
                      id="country-list"
                      inputProps={{ "aria-label": "Without label" }}
                      IconComponent={ExpandMoreOutlinedIcon}
                      value={answer}
                      displayEmpty
                      onChange={(event) => setAnswer(event.target.value)}
                      renderValue={
                        answer !== ""
                          ? undefined
                          : () => <Placeholder>Select Country</Placeholder>
                      }
                    >
                      <MenuItem value={10}>English (United states)</MenuItem>
                      <MenuItem value={20}>English (United kingdom)</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box className="terms-section">
                  <Link href="#">Help</Link>
                  <Link href="#">Terms</Link>
                  <Link href="#">Privacy</Link>
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            className="sign-right"
            style={{ minHeight: "700px" }}
          >
            {children}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
