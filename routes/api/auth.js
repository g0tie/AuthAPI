const router = require('express').Router();
const { register, login, activateAccount } = require('../../controllers/AuthController')

router.post('/register', register);
router.post('/login', login);
router.post('/activate/:id/:secretCode', activateAccount);

module.exports = router;