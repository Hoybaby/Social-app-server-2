const User = require("../../models/User");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

// validation
const {validateRegisterInput, validateLoginInput} = require('../../utils/validators')

const {UserInputError} = require('apollo-server');

const {SECRET_KEY} = require('../../config');

const generateToken = (user) => {
    return jwt.sign(
        {
        id: user.id,
        email: user.email,
        username: user.username
        // going to input my secret key below which i deconstructed from the config file. it is going into config file to hide sensitive information from github
    },
    SECRET_KEY, {expiresIn: '1h'});

}

module.exports = {
    Mutation: {

        // dont need to descontructure because we have in the typeDefs already
        async login(_, {username, password}) {
            const {errors, valid} = validateLoginInput(username, password)

            if(!valid) {
                throw  new UserInputError('Not Valid', {errors});
            }
            const user = await User.findOne({username})

            if(!user) {
                errors.general = 'User not found';
                throw new UserInputError('User not Found', {errors});
            } 

            const match = await bcrypt.compare(password, user.password);
            if(!match) {
                errors.general = "Wrong credentials"
                throw  new UserInputError('Wrong credentials', {errors});
            }

            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            }

            
        },
        // inside of the register function, needs to take some input
        // parents give us resaults from the input from last step, in some cases, you can have mutiple resolvers
        // register(parent, args,context, info)
        async register(
            _,
            { registerInput: { username, email, password, confirmPassword } },
            
        ) {
            // What i need to do: Validate user data,
            const {valid, errors} = validateRegisterInput( username, email, password, confirmPassword)
            if(!valid) {
                // I am passing in the payload of those errors I created in the validators.js
                throw new UserInputError('Errors', {errors})
            }
            // make sure users doesn't already exist
            // lines 22-29 makes sures that if user is found , it will register and error and not proceed to log in the results
            const user = await User.findOne(({username}));
            if(user) {
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is taken'
                    }
                })
            }
            // hash password before storing it in the database and create an auth token
            // the args
            // ------------
            // need to hash the password which is synchronous
            password = await bcrypt.hash(password,12);

            // user object
            const newUser = new User({
                email,
                username,
                password,
                // the method toISOSString is to convert the date to a string
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save()

            const token = generateToken(res)
            return {
                ...res._doc,
                id: res._id,
                token
            }
        },
    },
};
