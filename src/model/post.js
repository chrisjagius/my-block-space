import { Model } from 'radiks'

class Post extends Model {
    static className = 'Post'

    static schema = {
        post_id : { type: String, decrypted: true },
        username: { type: String, decrypted: true },
        is_post: { type: Boolean, decrypted: true },
        is_repost: { type: Boolean, decrypted: true },
        is_comment: { type: Boolean, decrypted: true },
        like_cnt: { type: Number, decrypted: true },
        repost_cnt: { type: Number, decrypted: true },
        comment_cnt: { type: Number, decrypted: true },
        original_post_id: { type: String, decrypted: true },
    }
}

export default Post