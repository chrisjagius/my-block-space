import {
    CURRENT_USER_FEED
} from '../actions';

const defaultState = {
    postIDs: [],
    postIDAndName: {},
    loaded: false,
    lastFetch: 0
}

const currentUserFeed = (state = defaultState, action) => {
    switch (action.type) {
        case CURRENT_USER_FEED:
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

export default currentUserFeed;