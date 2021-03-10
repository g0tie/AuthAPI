const UserModel = require('../models/User');
const { registerCheckPassword, 
    hashPassword, 
    passwordMatch 
} = require('../helpers/common');
const uniqid = require('uniqid');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {


    const { 
        email,
        name,
        password,
        passwordConfirm
    } = req.body;

    const userAlreadyExist = await UserModel.findOne({email: email});

    if (userAlreadyExist) {
        return res
        .status(422)
        .json({
            error: "User already exist"
        });
    }

    const passwordCheck = registerCheckPassword(password, passwordConfirm);

    if (!passwordCheck.status) {
        return res
        .status(422)
        .json({
            error: passwordCheck.msg
        });
    }

    const passwordHash = hashPassword(password) ;

    let newUser = new UserModel({
        email,
        name,
        password: passwordHash,
        secretCode: uniqid()
    });

    newUser.save();

    return res
    .status(201)
    .json({
        msg: "User registeration success",
        user: {
            id: newUser._id,
            email,
            name,
            createdAt: newUser.createdAt,
            isActive: newUser.isActive
        }
    })
}

exports.login = async (req, res) => {

    const { email, password } = req.body;
    const userExist = await UserModel.findOne({email: email});

    if (!userExist) {
        return res
        .status(422)
        .json({
            error: "User doesn't exist"
        });
    }

    let passwordMatching = passwordMatch(password, userExist.password);

    if (!passwordMatching) {
        return res
        .status(422)
        .json({
            error: "Incorect password"
        });
    }
    
    if (!userExist.isActive) {
        return res
        .status(422)
        .json({
            error: "Your account has not been validated yet."
        });
    }

    try {

        const token = jwt.sign({ 
            username: userExist.name, 
            email: userExist.email, 
            id: userExist._id 
        }, 
            process.env.TOKEN_SECRET, 
        {
            algorithm: "HS256",
            expiresIn: 300,
        });

        return res
        .status(201)
        .json({
            userId: userExist._id,
            token,

        });

    } catch (err) {
        console.log(err);
        return res
        .status(422)
        .json({
            error: err
        })
    }
  
}

exports.activateAccount = async (req, res) => {

    const { id, secretCode } = req.params;
    const user = await UserModel.findOne({_id:id});

    if (!user) {
        return res
        .status(422)
        .json({
            error: "No user found"
        })
    }

    if (user.secretCode === secretCode && !user.isActive) {
        user.isActive = true;
        user.save();

        return res
        .status(201)
        .json({
            msg: "User account is now active"
        })
    } else {
        return res
        .status(422)
        .json({
            msg: "User account is already active"
        })
    }

}

exports.refreshToken = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res
        .status(401)
        .json({
            error: "token invalid"
        })
    }

    let payload;

    try {

        payload = await jwt.verify(token, process.env.TOKEN_SECRET);

    } catch (err) {
        console.log(err);
        res
        .status(401)
        .json({
            error: err
        });
    }

    const user = await UserModel.findOne({_id: payload.id});

    const newToken = jwt.sign({
        username: user.name,
        email: user.email,
        id: user._id
    },
    process.env.TOKEN_SECRET,
    {
        algorithm: "HS256",
        expiresIn: 300,
    });

    return res
    .status(201)
    .json({
        userId: payload.id,
        token: newToken
    });


}