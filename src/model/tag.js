import { Model } from 'radiks'

class Tag extends Model {
    static className = 'Tag'

    static schema = {
        tag: { type: String, decrypted: true },
        post_ids: { type: Array, decrypted: true },
    }

}

export default Tag