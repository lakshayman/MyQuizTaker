import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";
import { logoutUser, changeElementQuestion } from "../../actions/authActions";
import './index.css';

function QuizInput(props){
  const { user } = props.auth;
  const [ques, setQues] = useState(user.currentElements[props.ukey].question);
  const dispatch = useDispatch();
    const handleElement = (e) =>{
      dispatch(changeElementQuestion(props.ukey,e.target.value));
      setQues(e.target.value);
    }
    return (
        <div className="formContainer">
            <form className="formbox rounded d-flex flex-column justify-content-around">
                <input name={props.name} className="input-lg linp" value={ques} disabled={props.isEditing} onChange={handleElement}/>
                <input className="input-lg inp" disabled={props.isCreating}/>
            </form>
        </div>
    );
}

QuizInput.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { logoutUser, changeElementQuestion }
)(QuizInput);