import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./index.css";
import { connect, useDispatch } from "react-redux";
import { loginUser } from "../../actions/authActions";
var mailformat = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
function LoginPage(props) {
  const [loginData, setLoginData] = useState({
    lemail: "",
    lpass: "",
  });
  const [isLoading, setLoading] = useState(false);
  const [isEmailCorrect, setEmailCorrect] = useState(false);
  const [isPassCorrect, setPassCorrect] = useState(false);
  const [isError, setError] = useState(false);
  const [errors, setErr] = useState([]);
  const dispatch = useDispatch();

  useEffect(()=>{
    if(props.auth.isAuthenticated){
      props.history.push("/dashboard")
    }
  },[])

  useEffect(()=>{
    if(props.auth.isAuthenticated){
      props.history.push("/dashboard")
    }
  },[props.auth])

  const checkValidity = (event) => {
    if (event.target.id === "lemail") {
      if (event.target.value.length === 0) {
        event.target.style.border = "none";
        setEmailCorrect(false);
      } else if (event.target.value.match(mailformat)) {
        event.target.style.border = "solid";
        event.target.style.borderColor = "lightgreen";
        setEmailCorrect(true);
      } else {
        event.target.style.border = "solid";
        event.target.style.borderColor = "red";
        setEmailCorrect(false);
      }
    } else if (event.target.id === "lpass") {
      if (event.target.value.length === 0) {
        event.target.style.border = "none";
        setPassCorrect(false);
      } else {
        event.target.style.border = "solid";
        event.target.style.borderColor = "lightgreen";
        setPassCorrect(true);
      }
    }
  };
  const change = (event) => {
    checkValidity(event);
    setLoginData((prev) => ({
      ...prev,
      [event.target.id]: event.target.value,
    }));
  };

  const setErrorTrue = (err)=>{
    setErr(err.errors);
    setError(true);
  }

  const handleSubmit = () => {
    setLoading(true);
    dispatch(loginUser({emailid: loginData.lemail, password: loginData.lpass}, setErrorTrue));
    setLoading(false);
  };
  return (
      <div className="container-fluid louter-container align-items-center flex-column d-flex justify-content-center">
        {isLoading && <div className="loading"></div>}
        <h1 className="display-1 lname position-static">Quiz Taker</h1>
        <div
          id="lform"
          className="position-static d-flex flex-column align-items-center"
          >
          <h2 id="lheading" className="my-2 justify-content-center">
            Login
          </h2>
  
          <input
            id="lemail"
            type="email"
            onChange={change}
            placeholder="Enter Email Id*"
            required
            className="my-2 form-control form-control-lg"
          />
  
          <input
            id="lpass"
            type="password"
            onChange={change}
            placeholder="Enter Password*"
            required
            className="my-2 form-control form-control-lg"
          />
          {isError && errors.map((err)=>{
            let [key, val] = Object.entries(err)[0];
            return <p key={key} style={{ color: "brown" }}>{key} {val}</p>
          })}
          <p className="grey-text text-darken-1">
            <Link to="/register">Don't have an account? </Link>
          </p>
  
          <input
            id="lbutton"
            type="button"
            value="SUBMIT"
            disabled={!isEmailCorrect || !isPassCorrect}
            onClick={handleSubmit}
            className="my-2 form-control form-control-lg"
          />
        </div>
      </div>
  );
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps, { loginUser })(LoginPage);
