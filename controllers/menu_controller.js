const Menu = require('../model/Menu');


// Get all menus
exports.getAllMenus = (req, res, next) => {
    Menu.find()
        .then((menus) => res.json(menus))
        .catch(next);
};

// Create a new menu with an image
exports.createMenu = (req, res, next) => {
    const { menuName, price, image } = req.body;
    // const imagePath = req.file ? req.file.path : null; // Get the file path of the uploaded image
    Menu.create({ menuName, price, image, user: req.user.id })
        .then((menu) => res.status(201).json(menu))
        .catch(next);
};

// Delete all menu
exports.deleteAllMenu = (req, res, next) => {
    Menu.deleteMany({})
        .then((reply) => res.status(204).end())
        .catch(next)
}

// Get a menu by ID
exports.getMenuById = (req, res, next) => {
    Menu.findOne({ _id: req.params.menu_id, user: req.user.id })
        .then((menu) => {
            if (!menu) return res.status(404).json({ error: 'Menu not found' });
            res.json(menu);
        })
        .catch(next);
};


// Update a menu by ID 
exports.updateMenuById = (req, res, next) => {
    const query = { _id: req.params.menu_id, user: req.user.id }

    const menu = {
        menuName: req.body.menuName,
        price: req.body.price
    }
    Menu.findOneAndUpdate(query, menu, { new: true })
        .then((menu) => {
            if (!menu) {
                res.status(404)
                return next(new Error('Menu not found'))
            }
            res.json(menu)
        })
        .catch(next)

};

// Delete a menu by ID
exports.deleteMenuById = (req, res, next) => {
    const query = { _id: req.params.menu_id, user: req.user.id }
    Menu.findOneAndDelete(query)
        .then((menu) => {
            if (!menu) {
                res.status(404)
                return next(new Error('Menu not found'))
            }
            res.status(204).end()
        })
        .catch(next)
}

exports.menuImageUpload = (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: "Please upload a file" });
    }
    res.status(200).json(req.file.filename);
};
