import { LOG_IN, LOG_OUT } from "../constants/action-types";

const initialState = {
  user: { isStudent: false, isTeacher: false, isAdmin: false }
};

function rootReducer(state = initialState, action) {
  if (action.type === LOG_IN) {
    state = {
      ...state,
      user: action.details
    }
  } else if (action.type === LOG_OUT) {
    state = {
      ...state,
      user: { isStudent: false, isTeacher: false, isAdmin: false }
    }
  }
  return state;
};

export default rootReducer;
