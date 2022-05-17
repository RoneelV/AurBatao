import { auth, provider } from "../firebase";
import userSave from "../utils/userSave";
import changeStatus from "../utils/changestatus";
import { useContext } from "react";
import { LoginContext } from "../LoginContext";

const SignIn = () => {
  let [, setUser] = useContext(LoginContext);

  const signInWithGoogle = async () => {
    try {
      let res = await auth.signInWithPopup(provider);
      // console.log(res);
      changeStatus();
      userSave();
      setUser(res);
    } catch (e) {
      console.log("SignIn: " + e);
    }
  };

  return (
    <div className="app-signin-container">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          minHeight: "90vh",
        }}
      >
        <div className="row">
          <div className="app-header">
            <h1 className="app-logo-front">AURBATAO!</h1>
          </div>
        </div>
        <div
          className="row"
          style={{ width: "100%", justifyContent: "center" }}
        >
          <div className="col-md-3">
            <button
              className="btn btn-lg btn-light"
              onClick={signInWithGoogle}
              style={{ textTransform: "none" }}
            >
              <img
                width="20px"
                style={{ marginBottom: "3px", marginRight: "5px" }}
                alt="Google sign-in"
                src="/G_Logo.webp"
              />
              Login with Google
            </button>
          </div>
        </div>
        <div className="app-footer">Made with ❤ by Group 37</div>
      </div>
    </div>
  );
};

export default SignIn;
