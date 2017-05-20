const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const mainController = require('../controllers/mainController')
const ratingController = require('../controllers/ratingController')

router.get('/', userController.homePage)
router.get('/succes', userController.authSucces)

router.get('/main', mainController.mainPage)
router.post('/main/:id/rating', ratingController.rating)

module.exports = router
