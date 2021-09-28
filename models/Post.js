const {model, Schema } = require('mongoose');

const postSchema = new Schema({
    body: String,
    username: String,
    createdAt: String,
    comments: [
        {
            body: String,
            username: String,
            createdAt: String
        }
    ],
    likes: [
        {
            username: String,
            createdAt: String,
        }
    ],
    // this allows us to later mongoose to automaticall populate user field
    user: {
        type: Schema.Types.ObjectId,
        ref:'users'
    }
})


module.exports = model('Post', postSchema)