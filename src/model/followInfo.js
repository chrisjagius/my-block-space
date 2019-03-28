import { Model } from 'radiks'

class FollowInfo extends Model {
    static className = 'FollowInfo'

    static schema = {
        username: { type: String, decrypted: true },
        following_cnt: { type: Number, decrypted: true },
        follower_cnt: { type: Number, decrypted: true },
        following: { type: Array, decrypted: true },
        followers: { type: Array, decrypted: true },
    }

    static findFollowInfoByUsername(username, options = { decrypt: true }) {
        return this.findOne({ username, options });
    }

}

export default FollowInfo