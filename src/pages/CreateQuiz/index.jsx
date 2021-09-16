import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";
import { logoutUser, addElement, setTitle } from "../../actions/authActions";
import NavBar from "../../components/NavBar";
import axios from 'axios';
import "./index.css";
import QuizInput from '../../components/QuizInput';
import { useHistory } from "react-router";
import { serverURL } from "../../ServerConst";
function Create(props) {
  const { user } = props.auth;
  const history = useHistory();
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const [quizId, setQuizId] = useState(-1);
  const [title, setTitle] = useState(user.currentQuizTitle);
  const [formData,updateData] = useState(user.currentElements);
  const [formElements, updateElement] = useState([]);
  const updateFormElements = ()=>{
    let temp = [];
    formData.map((ele, index) =>{
      if(ele.type === 'input'){
        temp.push(<QuizInput name='question' key={index} ukey={index} isEditing={false} isCreating={true}/>);
      }
    });
    updateElement(temp);
  }
  const onLogoutClick = e => {
    e.preventDefault();
    props.logoutUser();
  };
  const handleChange = (e) => {
    dispatch(props.setTitle(e.target.value));
    setTitle(e.target.value);
  }
  const handleClick = () => {
    dispatch(addElement({type: 'input', question: 'Question'}));
    updateData(prev => [...prev, {type: 'input', question: 'Question'}])
  }
  const handleSubmit = () => {
    setLoading(true);
    axios
        .post(serverURL + "api/addQuiz", {
          userId: user.userId,
          title: user.currentQuizTitle,
          quizElements: user.currentElements
        })
        .then(res => {
          window.location.href = '/MyQuizTaker/#/';
        })
        .catch(err =>{
          alert(err);
        })
      setLoading(false)
  }
  useEffect(()=>{
    setLoading(true);
    axios
      .post(serverURL + "api/getQuizes", {
        userId: user.userId
      })
      .then(res => {
        setQuizId(res.data.quizes.length);
      })
      .catch(err =>{
        alert(err);
      })
      setLoading(false);
  },[]);
  useEffect(()=>{
    updateFormElements();
  },[formData])
    console.log(user);
return (
  <>
  {isLoading && <div className="loading"></div>}
  <NavBar onLogoutClick={onLogoutClick}/>
  <div className="container">
    {quizId !== -1 && <p className="mt-3 display-6">Quiz No. {quizId}</p>}
    <input className="input-lg linp mt-3" value={title} onChange={handleChange}/>
    {formElements.map(element=>element)}
    <button className="m-3 rounded b" onClick={handleClick}>Add</button>
    <button className="m-3 rounded b" onClick={handleSubmit}>Submit</button>
  </div>
  </>
);
  
}
Create.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { logoutUser, addElement, setTitle }
)(Create);