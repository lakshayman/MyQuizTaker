import {
    SET_CURRENT_USER,
    SET_CURRENT_TITLE,
    ADDELEMENT,
    CHANGEQUESTION
  } from "../Constants";
  const isEmpty = require("is-empty");
  const initialState = {
    isAuthenticated: false,
    user: {},
    loading: false
  };
  export default function(state = initialState, action) {
    switch (action.type) {
      case SET_CURRENT_USER:
        return {
          ...state,
          isAuthenticated: !isEmpty(action.payload),
          user: action.payload
        };
      case SET_CURRENT_TITLE:
        return {
          ...state,
          user: {
            ...state.user,
            currentQuizTitle: action.payload
          }
        };
      case ADDELEMENT:
        return {
          ...state,
          user: {
            ...state.user,
            currentElements: [...state.user.currentElements, action.payload]
          }
        }
      case CHANGEQUESTION:
        state.user.currentElements[action.payload.key].question = action.payload.question;
        return {
          ...state
        }
      default:
        return state;
    }
  }