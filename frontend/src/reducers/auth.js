import { 
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    USER_LOADED_SUCCESS,
    USER_LOADED_FAIL,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    PASSWORD_RESET_FAIL,
    PASSWORD_RESET_SUCCESS,
    PASSWORD_RESET_CONFIRM_FAIL,
    PASSWORD_RESET_CONFIRM_SUCCESS,
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    ACTIVATION_FAIL,
    ACTIVATION_SUCCESS,
    LOGOUT

} from "../actions/types";

const initialState = {
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
    isAuthenticated: null,
    user: null,
    message: '',
};

export default function(state = initialState, action) {
    const { type, payload } = action; //destructuring action i.e.  console.log(type) => prints action.type
    switch(type) {
        case AUTHENTICATED_SUCCESS:
            return {
                ...state,
                isAuthenticated: true
            }
        case LOGIN_SUCCESS:
            localStorage.setItem('access', payload.access);
            return {
                ...state,                   //copying an instance of state i.e copying an instance of initialState
                isAuthenticated: true,
                access: payload.access,
                refresh: payload.refresh,
                message: 'You have been logged in.'
            }
        
        case SIGNUP_SUCCESS:
            return {
                ...state,
                isAuthenticated: false,
                message: 'Sign up successful.'
            }
            
        case USER_LOADED_SUCCESS:
            return {
                ...state,                   //copying an instance of state i.e copying an instance of initialState
                user: payload
            }

        case AUTHENTICATED_FAIL:
            return {
                ...state,
                isAuthenticated: false
            }
        case USER_LOADED_FAIL:
            return {
                ...state,                   //copying an instance of state i.e copying an instance of initialState
                user: null
            }

        case LOGIN_FAIL:
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            return {
                ...state,                   //copying an instance of state i.e copying an instance of initialState
                access: null,
                refresh: null,
                isAuthenticated: false,
                user: null,
                message: 'Login Failed',
            } 
        
        case SIGNUP_FAIL:
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            return {
                ...state,                   //copying an instance of state i.e copying an instance of initialState
                access: null,
                refresh: null,
                isAuthenticated: false,
                user: null,
                message: 'Sign Up failed. Password too common or similar to the name/email.'
            } 

        case LOGOUT:
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            return {
                ...state,                   //copying an instance of state i.e copying an instance of initialState
                access: null,
                refresh: null,
                isAuthenticated: false,
                user: null
            } 

        case PASSWORD_RESET_SUCCESS:
        case PASSWORD_RESET_FAIL:
        case PASSWORD_RESET_CONFIRM_SUCCESS:
        case PASSWORD_RESET_CONFIRM_FAIL:
        case ACTIVATION_SUCCESS:
            return {
                ...state,
                message: 'Your account has been activated.'
            }
        case ACTIVATION_FAIL:
            return {
                ...state
            }
        default:
            return state
    }
}