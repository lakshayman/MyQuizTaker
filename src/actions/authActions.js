import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import {
  ADDELEMENT,
  SET_CURRENT_TITLE,
  SET_CURRENT_USER,
  CHANGEQUESTION,
  SET_ELEMENTS
} from "../Constants";

export const setElements = (elements) => {
  return {
    type: SET_ELEMENTS,
    payload: elements
  }
}

export const loginUser = (userData, setErrorTrue) => dispatch => {
  axios
    .post("http://localhost:8000/api/login", userData)
    .then(res => {
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      setAuthToken(token);
      const decoded = jwt_decode(token);
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>{
      setErrorTrue(err.response.data)
      console.log(err.response.data);
    }
    );
};

export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

export const setTitle = title => {
  let payload = title;
  return {
    type: SET_CURRENT_TITLE,
    payload
  }
}

export const addElement = ele => {
  let payload = ele;
  return {
    type: ADDELEMENT,
    payload
  }
}

export const changeElementQuestion = (k, ques) => {
  let payload = {
    key: k,
    question: ques
  }
  return {
    type: CHANGEQUESTION,
    payload
  }
}

export const logoutUser = () => dispatch => {
  localStorage.removeItem("jwtToken");
  setAuthToken(false);
  dispatch(setCurrentUser({}));
};