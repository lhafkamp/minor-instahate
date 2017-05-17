const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const imageController = require('../controllers/imageController')

router.get('/', userController.homePage)
router.get('/succes', userController.authSucces)

router.get('/main', imageController.mainPage)
router.post('/main/:id/rating', userController.storeRating)

module.exports = router
