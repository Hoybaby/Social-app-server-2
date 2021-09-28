const postsResolvers = require('./posts')
const userResolvers = require('./users')
const commentsResolvers = require('./comments')

module.exports = {
    // modifiers. If we have the name of the type, like Post, and we do something to change the fields, it will go through this Post modifier to apply the changes
    Post: {
        // parent holds the data from the previous step
        likeCount: (parent) => parent.likes.length,
        commentCount:(parent) => parent.comments.length
    },

    Query: {
        ...postsResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentsResolvers.Mutation
    }
}