const { AuthenticationError } = require('apollo-server');

const jwt = require('jsonwebtoken');
// this secret will varify the token because we used it like this
const {SECRET_KEY} = require('../config')

module.exports = (context) => {
    // context
    const authHeader = context.req.headers.authorization;
    if (authHeader) {
        // working with tokens, we send it with Bearer 'xxxx'
        const token = authHeader.split('Bearer ')[1];
        // if this fails, the token isnt valid
        if(token) {
            try {
                const user = jwt.verify(token, SECRET_KEY);
                return user
            } catch(err) {
                throw new AuthenticationError('Invalid/Expired token')
            }
        }
        throw new Error('Authentication token must be \' Bearer [token]')
    }
    throw new Error('Authentication header must be provided');
}