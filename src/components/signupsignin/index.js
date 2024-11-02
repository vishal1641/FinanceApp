import React from "react";
import "./styles.css";
import { toast } from "react-toastify";
import Input from "../input";
import { useState } from "react";
import Button from "../Button";
import { auth, db, provider } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
const SignupSigninComponent = () => {
  const [loginForm, setLoginForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState("");
  const navigate = useNavigate();
  function signupWithEmail() {
    setLoading(true);
    console.log("Name", name);
    console.log("Email", email);
    console.log("Password", password);
    console.log("confirmPassword", confirmPassword);
    if (name != "" && email != "" && password != "" && confirmPassword != "") {
      if (password == confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            console.log("User>>>", user);
            toast.success("User Created!");
            setLoading(false);
            setName("");
            setConfirmPassword("");
            setPassword("");
            setEmail("");
            createDoc(user);
            navigate("/dashboard");
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
            // ..
          });
      } else {
        setLoading(false);
        toast.error("Password and Confirm Password donot match!");
      }
    } else {
      toast.error("All fields are mandatory!");
      setLoading(false);
    }
  }
  function loginUsingEmail() {
    console.log("Email", email);
    console.log("password", password);
    setLoading(true);
    if (email != "" && password != "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          toast.success("User Logged In!");
          console.log("user Logged in", user);
          setLoading(false);
          navigate("/dashboard");
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setLoading(false);
          toast.error(errorMessage);
        });
    } else {
      toast.error("All field are Mandatory");
      setLoading(false);
    }
  }
  async function createDoc(user) {
    setLoading(true);
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);
    if (!userData.exists()) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: new Date(),
        });
        toast.success("Doc Created!");
        setLoading(false);
      } catch (e) {
        toast.error(e.message);
        setLoading(false);
      }
    } else {
      toast.error("Doc already exists");
      setLoading(false);
    }
  }
  function googleAuth() {
    setLoading(true);
    try {
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          console.log("user>>>", user);
          createDoc(user);
          setLoading(false);
          navigate("/dashboard");
          toast.success("User Authenticated");
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        })
        .catch((error) => {
          // Handle Errors here.
          setLoading(false);
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    } catch (e) {
      setLoading(false);
      toast.error(e.message);
    }
  }
  return (
    <>
      {loginForm ? (
        <div className="signup-wrapper">
          <h2 className="title">
            Login on <span style={{ color: "var(--theme)" }}>Financly.</span>
          </h2>
          <form>
            <Input
              type="email"
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"johncena@gmail.com"}
            />
            <Input
              type="password"
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"Example@1234"}
            />

            <Button
              disabled={loading}
              text={loading ? "Loading..." : "Login using Email and Password"}
              onClick={loginUsingEmail}
            />
            <p className="p-login">or</p>
            <Button
              onClick={googleAuth}
              text={loading ? "Loading..." : "Login using Google"}
              blue={true}
            />
            <p
              className="p-login"
              style={{ cursor: "pointer" }}
              onClick={() => setLoginForm(!loginForm)}
            >
              Or Don't Have an Account already? Click Here
            </p>
          </form>
        </div>
      ) : (
        <div className="signup-wrapper">
          <h2 className="title">
            Sign Up on <span style={{ color: "var(--theme)" }}>Financly.</span>
          </h2>
          <form>
            <Input
              label={"Full Name"}
              state={name}
              setState={setName}
              placeholder={"John Cena"}
            />
            <Input
              type="email"
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"johncena@gmail.com"}
            />
            <Input
              type="password"
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"Example@1234"}
            />
            <Input
              type="password"
              label={"Confirm Password"}
              state={confirmPassword}
              setState={setConfirmPassword}
              placeholder={"Example@1234"}
            />
            <Button
              disabled={loading}
              text={loading ? "Loading..." : "SignUp using Email and Password"}
              onClick={signupWithEmail}
            />
            <p className="p-login">or</p>
            <Button
              onClick={googleAuth}
              text={loading ? "Loading..." : "SignUp using Google"}
              blue={true}
            />
            <p
              className="p-login"
              style={{ cursor: "pointer" }}
              onClick={() => setLoginForm(!loginForm)}
            >
              Or Have an Account already? Click Here
            </p>
          </form>
        </div>
      )}
    </>
  );
};

export default SignupSigninComponent;
