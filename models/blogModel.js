const mongoose = require('mongoose')
const Schema = mongoose.Schema

const blogSchema = Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    numViews: {
        type: Number,
        default: 0
    },
    isLiked: {
        type: Boolean,
        default: false
    },
    isDisliked: {
        type: Boolean,
        default: false
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    ],
    dislikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    ],
    // image: {
    //     type: String,
    //     default: "https://media.istockphoto.com/id/1008719744/photo/wood-block-cube-put-the-front-computer-keyboard-with-word-blog-and-empty-copy-space-for-your.webp?s=1024x1024&w=is&k=20&c=ZA6E9DPWcQ0si2VSeadiK3W3YW2eEXJBWT-Hvdnx0aY="
    // },
    author: {
        type: String,
        default: "Admin"
    },
    images: []
}, {
    toJSON: {
        virtuals: true
    }, toObjects: {
        virtuals: true
    }, timestamps: true
})

module.exports = mongoose.model("Blog", blogSchema)