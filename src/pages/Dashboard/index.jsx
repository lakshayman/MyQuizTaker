import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import NavBar from "../../components/NavBar";
import axios from 'axios';
import "./index.css";
function Dashboard(props) {
  const { user } = props.auth;

  const [quizes, setQuizes] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const onLogoutClick = e => {
    e.preventDefault();
    props.logoutUser();
  };
    useEffect(()=>{
      setLoading(true);
      axios
        .post("http://localhost:8000/api/getQuizes", {
          userId: user.userId
        })
        .then(res => {
          setQuizes(res.data.quizes);
        })
        .catch(err =>{
          alert(err);
        })
        setLoading(false);
    },[]);
    console.log(user);
return (
  <>
  {isLoading && <div className="loading"></div>}
  <NavBar onLogoutClick={onLogoutClick}/>
  <div>
    <p className="user">Hi <strong>{user.name}</strong>. {quizes.length !==0 ? "Here are your Quizes" : "You have no Quizes Right Now."}</p>
    <div className="container-fluid con">
      <ul className="cards">
    {quizes.map((quiz, index) => 
        ( <li className="cards_item">
          <div className="card">
            <div className="card_content">
              <h2 className="card_title">{index}</h2>
              <p className="card_text">{quiz.title}</p>
              <button className="btn card_btn">Edit Quiz</button>
            </div>
          </div>
        </li>
      )
    )}
    </ul>
    </div>
    </div>
  </>
);
  
}
Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { logoutUser }
)(Dashboard);