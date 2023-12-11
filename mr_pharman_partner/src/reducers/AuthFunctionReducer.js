import * as Actions from '../actions/ActionTypes'
const AuthFunctionReducer = (state = { partner_profile_picture:undefined }, action) => {

    switch (action.type) {
        case Actions.UPDATE_PARTNER_PROFILE_PICTURE:
            return Object.assign({}, state, {
                partner_profile_picture: action.data
            });
        default:
            return state;
    }
}

export default AuthFunctionReducer;


