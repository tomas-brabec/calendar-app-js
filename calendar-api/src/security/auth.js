/*
 * Generovani nahodneho klice
 * node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateToken = async (req, res, next) => {
    try {
        const auth = req.header('Authorization');
        if(!auth)
            throw 'Invalid token'

        const token = auth.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.KEY);
        const user = await User.findOne({ _id: decoded._id, 'auth.token': token });

        if (!user)
            throw 'Invalid credentials';

        req.user = user;
        req.token = token;
        next();
    } catch(e) {
        res.status(401).send({error: e});
    }
};

const isCorrectCredentials = async (user, password) => {
    const isMatch = await bcrypt.compare(password, user.password); 

    return isMatch;
};

const generateAuthToken = async (user) => {
    const token = jwt.sign({_id: user._id.toString(), email: user.email}, process.env.KEY, {expiresIn: '7 days'});
    user.auth = user.auth.concat({ token });
    await user.save();

    return token;
};

module.exports = {validateToken, isCorrectCredentials, generateAuthToken};