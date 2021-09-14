import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";
import { logoutUser, addElement, setTitle, setElements } from "../../actions/authActions";
import NavBar from "../../components/NavBar";
import axios from 'axios';
import "./index.css";
import QuizInput from '../../components/QuizInput';
import { useHistory, useParams } from "react-router";
function Edit(props) {
  let { index } = useParams();
  const { user } = props.auth;
  console.log(user);
  const history = useHistory();
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const [quizId, setQuizId] = useState(index);
  const [quiz, setQuiz] = useState({
    title: 'title',
    quizElements: []
  });
  const [formElements, updateElement] = useState([]);
  const updateFormElements = ()=>{
    let temp = [];
    quiz.quizElements.map((ele, index) =>{
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
    setQuiz(prev => ({...prev, title: e.target.value}));
  }
  const handleClick = () => {
    dispatch(addElement({type: 'input', question: 'Question'}))
    setQuiz(prev => ({...prev, quizElements: [...prev.quizElements, {type: 'input', question: 'Question'}]}));
  }
  const handleSubmit = () => {
    setLoading(true);
    axios
      .post("http://localhost:8000/api/editQuiz", {
        userId: user.userId,
        quizId: quizId,
        title: user.currentQuizTitle,
        quizElements: user.currentElements
      })
      .then(res => {
        window.location.href = '/';
      })
      .catch(err =>{
        alert(err);
      })
    setLoading(false)
  }
  useEffect(()=>{
    setLoading(true);
    axios
      .post("http://localhost:8000/api/getQuizes", {
        userId: user.userId
      })
      .then(res => {
        dispatch(props.setTitle(res.data.quizes[index].title));
        dispatch(props.setElements(res.data.quizes[index].quizElements));
        setQuiz(prev => ({...prev, title: res.data.quizes[index].title, quizElements: res.data.quizes[index].quizElements}))
      })
      .catch(err =>{
        alert(err);
      })
    setLoading(false);
  },[]);
  useEffect(()=>{
    updateFormElements();
  },[quiz])
    console.log(user);
return (
  <>
  {isLoading && <div className="loading"></div>}
  <NavBar onLogoutClick={onLogoutClick}/>
  <div className="container">
    <input className="input-lg linp" value={quiz.title} onChange={handleChange}/>
    {quizId !== -1 && <p>{quizId}</p>}
    {formElements.map(element=>element)}
    <button onClick={handleClick}>Add</button>
    <button onClick={handleSubmit}>Submit</button>
  </div>
  </>
);
  
}
Edit.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { logoutUser, addElement, setTitle, setElements }
)(Edit);