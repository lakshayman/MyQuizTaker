import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { serverURL } from '../../ServerConst';
function Quiz() {
    let { id } = useParams();
    let userId, quizNo;
    const [isLoading, setLoading] = useState(false);
    const [quizFound, setQuizFound] = useState(false);
    const [quiz, setQuiz] = useState({});
    const [response, setResponse] = useState({});
    const [formElements, updateElement] = useState([]);
    if(id.includes('&')){
        let [a, b] = id.split('&');
        userId = a;
        quizNo = b;
    }
    const handleChange = (e)=>{
        setResponse(prev => ({...prev, [e.target.name]: e.target.value}))
    }
    const handleSubmit = ()=>{
        setLoading(true);
        axios
            .post(serverURL + "api/submitResponse", {
                userId: userId,
                quizId: quizNo,
                response: response
            })
            .then(res => {
                alert("Your Response Submitted!");
                window.location.reload();
            })
            .catch(err =>{
                alert(err);
            })
        setLoading(false);
    }
    const updateFormElements = (quiz)=>{
        let temp = [];
        console.log(quiz)
        quiz.quizElements.map((ele, index) =>{
          if(ele.type === 'input'){
            temp.push(
                <div className="formContainer" key={index}>
                    <form className="formbox rounded d-flex flex-column justify-content-around">
                        <input className="input-lg linp" disabled={true} value={ele.question}/>
                        <input className="input-lg inp" name={`input${index}`} value={response[`input${index}`]} onChange={handleChange}/>
                    </form>
                </div>
            );
          }
        });
        updateElement(temp);
      }
    useEffect(()=>{
        if(id.includes('&')){
            setLoading(true);
            axios
                .post(serverURL + "api/getQuizes", {
                    userId: userId
                })
                .then(res => {
                    if(res.data.quizes.length > quizNo){
                        setQuizFound(true);
                        let q =res.data.quizes[quizNo];
                        q.quizElements.map((element,index) => {
                            setResponse(prev => ({...prev, [`input${index}`]: ''}));
                        });
                        setQuiz(q);
                        updateFormElements(q);
                    }
                })
                .catch(err =>{
                    alert(err);
                })
            setLoading(false);
        }
    },[]);
    return (
        <div>
            {isLoading && <div className="loading"></div>}
            {quizFound ? (<div>
                <h1 style={{padding: '1rem'}}>{quiz.title}</h1>
                {formElements.map(element=>element)}
                <button style={{margin: '1rem'}} onClick={handleSubmit}>Submit</button>
            </div>) : (<h1>No Quiz Found</h1>)}
        </div>
    );
}
export default Quiz;