const router = require('express').Router();
const { 
    register, 
    login, 
    activateAccount, 
    refreshToken, 
    logout 
} = require('../../controllers/AuthController')

router.post('/register', register);
router.post('/login', login);
router.post('/activate/:id/:secretCode', activateAccount);
router.post('/refresh', refreshToken);
// router.get('/logout', logout)

module.exports = router;