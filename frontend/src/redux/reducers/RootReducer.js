import authReducer from './AuthReducer';

export default function rootReducer(state = {}, action) {
    // always return a new object for the root state
    return {
        auth: authReducer(state.auth, action),
    }
}