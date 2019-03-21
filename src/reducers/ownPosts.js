import {
    CURRENT_USER_POSTS
} from '../actions';

const defaultState = {
    postIDs: [],
    postIDAndName: {},
    loaded: false,
    lastFetch: 0
}

const currentUserOwnPosts = (state = defaultState, action) => {
    switch (action.type) {
        case CURRENT_USER_POSTS:
            return {
                ...state,
                postIDs: action.payload.postIDs,
                postIDAndName: action.payload.postIDAndName,
                loaded: action.payload.loaded,
                lastFetch: action.payload.lastFetch
            };
        default:
            return state
    }
}

export default currentUserOwnPosts;