import { Link } from 'react-router-dom';
import './index.css';
import React from 'react';

function NavBar(props){
    return (
      <nav className="navbar sticky-top navbar-expand-lg navbar-dark color px-4">
        <div className="container-fluid">
          <a className="navbar-brand textcolor si" href="/MyQuizTaker/#/">QuizTaker</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-center">
              <li className="nav-item">
                <Link className="nav-link textcolor ho" to="/create">Create Quiz</Link>
              </li>
            </ul>
            <span className="navbar-text">
              <button className="nbutton rounded" onClick={props.onLogoutClick}>Logout</button>
            </span>
          </div>
        </div>
      </nav>
    );
}

export default NavBar;