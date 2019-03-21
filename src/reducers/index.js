import { combineReducers } from 'redux';
import currentUserInfo from './user';
import currentUserOwnPosts from './ownPosts';
import currentUserFeed from './feed';


const reducer = combineReducers({
    curuserInfo: currentUserInfo,
    curUserOwnPosts: currentUserOwnPosts,
    curUserFeed: currentUserFeed
})

export default reducer;