import { Model } from 'radiks'

class Tag extends Model {
    static className = 'Tag'

    static schema = {
        tag: { type: String, decrypted: true },
        post_id: { type: String, decrypted: true },
        username: { type: String, decrypted: true},
    }

}

export default Tag