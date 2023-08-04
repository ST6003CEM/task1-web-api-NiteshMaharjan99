const express = require('express')
const { verifyUser, verifyAdmin } = require('../middlewares/auth')
const menuController = require('../controllers/menu_controller')
const upload = require('../middlewares/upload')

const router = express.Router()

router.use(verifyUser).route('/')
    .get(menuController.getAllMenus)
    .post(menuController.createMenu)
    .delete(verifyAdmin,menuController.deleteAllMenu)

router.use(verifyUser).route('/:menu_id')
    .get(menuController.getMenuById)
    .put(menuController.updateMenuById)
    .delete(menuController.deleteMenuById)

router.route('/uploadImage', upload.single("menuImage"),)
    .post(menuController.menuImageUpload)

module.exports = router