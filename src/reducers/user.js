import {
    CURRENT_USER_INFO
} from '../actions';
const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

const defaultState = {
    person: {
        name() {
            return 'Anonymous';
        },
        avatarUrl() {
            return avatarFallbackImage;
        },
        description() {
            return 'No description'
        }
    },
    username: null,
    friends: [],
    loaded: false
}


const currentUserInfo = (state = defaultState, action) => {
    switch (action.type) {
        case CURRENT_USER_INFO:
            return {
                ...state,
                person: action.payload.person,
                username: action.payload.username,
                friends: action.payload.friends,
                loaded: action.payload.loaded
            };
        default:
            return state
    }
}

export default currentUserInfo;