
import {
    loadUserData,
    getFile,
    Person
} from 'blockstack';

export const CURRENT_USER_INFO = "CURRENT_USER_INFO ";
export const CURRENT_USER_POSTS = "CURRENT_USER_POSTS";
export const CURRENT_USER_FEED = "CURRENT_USER_FEED";

async function loadFriends(username) {
    const options = { decrypt: false }
    let file = await getFile('friends.json', options)
    try {
        let friends = JSON.parse(file || '[]')
        if (!friends.includes(username)) { friends.push(username) }
        return friends
    } catch (e) {
        console.log(`error loading friends. message: ${e}`)
    }
}

export function currentUserInformation() {
    return async (dispatch, getState) => {
        let userData = loadUserData()
        let person = await new Person(userData.profile)
        let username = await userData.username
        let friends = await loadFriends(username);
        //use result to set userinfo
        try {
            const curUserInfo = {
                person: person,
                username: username,
                friends: friends,
                loaded: true
            }
            dispatch({
                type: CURRENT_USER_INFO,
                payload: curUserInfo
            });
        } catch (e) {
            console.log(`error in actions/index.js. message: ${e}`)
        }
    };
}
export function addToCurrentUserPosts(postIDs, postIDAndName) {
    return (dispatch) => {
        const curUserPosts = {
            postIDs,
            postIDAndName,
            loaded: true,
            lastFetch: Date.now()
        }
        dispatch({
            type: CURRENT_USER_POSTS,
            payload: curUserPosts
        })
    }
}

export function addToCurrentUserFeed(postIDs, postIDAndName) {
    return (dispatch) => {
        const curUserFeed = {
            postIDs,
            postIDAndName,
            loaded: true,
            lastFetch: Date.now()
        }
        dispatch({
            type: CURRENT_USER_FEED,
            payload: curUserFeed
        })
    }
}
