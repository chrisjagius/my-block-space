import { combineReducers } from 'redux';
import currentUserInfo from './user';


const reducer = combineReducers({
    curuserInfo: currentUserInfo
})

export default reducer;