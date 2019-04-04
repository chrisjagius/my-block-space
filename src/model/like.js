import { Model } from 'radiks';

class LikeInfo extends Model {
    static className = 'LikeInfo'

    static schema = {
        post_id: { type: String, decrypted: true },
        username: { type: String, decrypted: true },
        liked: { type: Boolean, decrypted: true},
    }
}

export default LikeInfo