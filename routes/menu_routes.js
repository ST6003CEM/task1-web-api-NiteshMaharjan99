const express = require('express')
const { verifyUser, verifyAdmin } = require('../middlewares/auth')
const menuController = require('../controllers/menu_controller')

const menuRouter = express.Router()

menuRouter.use(verifyUser).route('/')
    .get(menuController.getAllMenus)
    .post(menuController.createMenu)
    .delete(verifyAdmin, menuController.deleteAllMenu)

menuRouter.use(verifyUser).route('/:note_id')
    .get(menuController.getMenuById)
    .put(menuController.updateMenuById)
    .delete(menuController.deleteMenuById)

menuRouter.use().route('/uploadImage')
    .post(menuController.menuImageUpload)

module.exports = menuRouter