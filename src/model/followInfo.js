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

}

export default FollowInfo