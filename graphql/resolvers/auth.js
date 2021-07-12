const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');

module.exports = {
    createUser: async args => {
        try {
            const { email, password } = args.userInput;
            const existingUser = await User.findOne({ email });
            if (existingUser) {throw new Error("User already exists")}
            const user = new User({email, password: bcrypt.hashSync(password, 10)});
            const res = await user.save();
            return { ...res._doc, password: null };
        } catch (err) { throw new Error("User not created"); }
    },
    login: async ({ email, password }) => {
        const user = await User.findOne({email: email});
        if (!user){
            throw new Error('User does not exist');
        };
        const isEqual = await bcrypt.compare(password, user.password)
        if (!isEqual) {
            throw new Error('Password is incorrect')
        };
        const token = jwt.sign({userId: user.id, email: user.email}, 'somesupersecretkey',{
            expiresIn: '1h'
        });
        return { userId: user.id, token: token, tokenExpiration: 1}
    },
}
