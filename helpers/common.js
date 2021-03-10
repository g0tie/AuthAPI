const { genSaltSync, hashSync, compareSync} = require('bcrypt');

exports.registerCheckPassword = (password, passwordConfirm) => {
    if (password === passwordConfirm) {
        return {
            status: true,
            msg: "Password Match"
        }
    }

    return {
        status: false,
        msg: "Password and Password Confirm are not the same"
    };
}

exports.hashPassword = (password) => {
    const salt = genSaltSync(12);
    const hashedPassword = hashSync(password, salt);

    return hashedPassword;
}

exports.passwordMatch = (password, hashedPassword) => {
    return compareSync(password, hashedPassword);
}
