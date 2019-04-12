import { Model } from 'radiks'

class Post extends Model {
    static className = 'Post'

    static schema = {
        _id : { type: String, decrypted: true },
        username: { type: String, decrypted: true },
        is_post: { type: Boolean, decrypted: true },
        is_repost: { type: Boolean, decrypted: true },
        is_comment: { type: Boolean, decrypted: true },
        like_cnt: { type: Number, decrypted: true },
        repost_cnt: { type: Number, decrypted: true },
        comment_cnt: { type: Number, decrypted: true },
        original_post_id: { type: String, decrypted: true },
        original_poster_username: { type: String, decrypted: true },
    }

    static defaults = {
        like_cnt: 0,
        repost_cnt: 0,
        comment_cnt: 0
    }
}

export default Post