const { MenuItem } = require('../models/MenuItem');
const fs = require('fs').promises;

async function readJSON(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (err) { console.error(err); throw err; }
}

async function writeJSON(object, filename) {
    try {
        const allObjects = await readJSON(filename);
        allObjects.push(object);
        await fs.writeFile(filename, JSON.stringify(allObjects), 'utf8');
        return allObjects;
    } catch (err) { console.error(err); throw err; }
}

async function addMenuItem(req, res) {
    try {
        const name = req.body.name;
        const price = req.body.price;
        const description = req.body.description;

        if (typeof name !== 'string' || name.length < 2 ||
            typeof description !== 'string' || description.length < 6 ||
            typeof price !== 'number' || price <= 0) {
            return res.status(500).json({ message: 'Validation error' });
        }
        const newMenuItem = new MenuItem(name, price, description);

        const updatedMenu = await writeJSON(newMenuItem, './utils/menu.json');

        return res.status(201).json(updatedMenu);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { readJSON, writeJSON, addMenuItem };