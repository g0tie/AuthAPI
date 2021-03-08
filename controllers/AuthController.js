const UserModel = require('../models/User');
const { registerCheckPassword, 
    hashPassword, 
    passwordMatch 
} = require('../helpers/common');

exports.register = (req, res) => {


    const { 
        email,
        name,
        password,
        passwordConfirm
    } = req.body;

    const userAlreadyExist = UserModel.findOne({email: email});

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
        password: passwordHash
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

exports.login = (req, res) => {

    const { email, password } = req.body;
    const userExist = UserModel.findOne({email: email});

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

    //genère auth token
}