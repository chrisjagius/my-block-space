import { Model } from 'radiks'

class Post extends Model {
    static className = 'Post'

    static schema = {
        username: { type: String, decrypted: true },
        user_img_url: { type: String, decrypted: true },
        text: { type: String, decrypted: true },
        image: { type: String, decrypted: true },
        is_post: { type: Boolean, decrypted: true },
        is_repost: { type: Boolean, decrypted: true },
        is_comment: { type: Boolean, decrypted: true },
        like_cnt: { type: Number, decrypted: true },
        repost_cnt: { type: Number, decrypted: true },
        comment_cnt: { type: Number, decrypted: true },
        original_post_id: { type: String, decrypted: true },
    }

    static findByPostId(postId, options = { decrypt: true }) {
        return this.findOne({ postId, options });
    }
}

export default Post