import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";
import { logoutUser, addElement, setTitle, setElements } from "../../actions/authActions";
import NavBar from "../../components/NavBar";
import axios from 'axios';
import "./index.css";
import QuizInput from '../../components/QuizInput';
import { useHistory, useParams } from "react-router";
import { serverURL } from "../../ServerConst";
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
  const [responseTitle, setRT] = useState('');
  const [responseEle, setRE] = useState([]);
  const [buttons, setButtons] = useState([]);
  const [responses, setResponses] = useState([]);
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
  const updateResponseElements = (res) => {
    let temp = [];
    quiz.quizElements.map((ele, index) =>{
      temp.push(<div className="formContainer">
            <form className="formbox rounded d-flex flex-column justify-content-around">
                <input name={props.name} className="input-lg linp" value={ele.question} disabled={true}/>
                <input className="input-lg inp" value={res[`input${index}`]} disabled={true}/>
            </form>
        </div>)
    });
    setRE(temp);
  }
  const updateButtons = ()=>{
    let temp = [];
    responses.map((res,index)=>{
      temp.push(<button className="rounded m-3 b" onClick={rbClick} name={index}>{`Response ${index}`}</button>)
    })
    setButtons(temp);
  }
  const onLogoutClick = e => {
    e.preventDefault();
    props.logoutUser();
  };
  const rbClick = (e)=>{
    let response = responses[e.target.name].response;
    setRT(quiz.title);
    updateResponseElements(response);
  }
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
      .post(serverURL + "api/editQuiz", {
        userId: user.userId,
        quizId: quizId,
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
        dispatch(props.setTitle(res.data.quizes[index].title));
        dispatch(props.setElements(res.data.quizes[index].quizElements));
        setQuiz(prev => ({...prev, title: res.data.quizes[index].title, quizElements: res.data.quizes[index].quizElements}))
      })
      .catch(err =>{
        alert(err);
      });
    axios
      .post(serverURL + "api/getResponses",{
        userId: user.userId,
        quizId: quizId
      }).then(res => {
        setResponses(res.data.responses);
      }).catch(err => {
        alert(err);
      })
    setLoading(false);
  },[]);
  useEffect(()=>{
    updateFormElements();
  },[quiz])
  useEffect(()=>{
    updateButtons();
  },[responses])
    console.log(user);
return (
  <>
  {isLoading && <div className="loading"></div>}
  <NavBar onLogoutClick={onLogoutClick}/>
  <div className="container">
    {quizId !== -1 && <p className="mt-3 display-5">{quizId}</p>}
    <a href={`${new URL(window.location.href).origin}/MyQuizTaker/#/quiz/${user.userId}&${quizId}`} target="_blank">{`${new URL(window.location.href).origin}/MyQuizTaker/#/quiz/${user.userId}&${quizId}`}</a>
    <input className="input-lg linp mt-3" value={quiz.title} onChange={handleChange}/>
    {formElements.map(element=>element)}
    <button className="m-3 rounded b" onClick={handleClick}>Add</button>
    <button className="m-3 rounded b" onClick={handleSubmit}>Submit</button>
  </div>
  <div className="container">
    <div className="responsesButtonCont">
      {buttons}
    </div>
    <h1>{responseTitle}</h1>
    {responseEle.map(element=>element)}
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