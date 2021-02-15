const fs = require('fs');

module.exports.routes = (obj) => {
    let objname = obj.name.toLowerCase() + 's';

    let content = "const express = require('express');\nconst router = express.Router();\n";
    content += "\n";
    content += "const " + objname + " = require('../controllers/script.controller');\n";
    content += "\n";

    content += "router.get('/', " + objname + "Ctrl.findAll);\n";
    content += "router.get('/:id', " + objname + "Ctrl.findOne);\n";
    content += "router.post('/', " + objname + "Ctrl.create);\n";
    content += "router.put('/:id', " + objname + "Ctrl.update);\n";
    content += "router.delete('/:id', " + objname + "Ctrl.delete);\n";
    content += "\n";
    content += "export default router;";

    try {
        if (!fs.existsSync('./proyecto/src')) {
            fs.mkdir('./proyecto/src/routes', { recursive: true }, (err) => {
                fs.writeFileSync('./proyecto/src/routes/' + obj.name.toLowerCase() + '.routes.js', content, { mode: 0o777 });
                if (err) throw err;
            });
        }
    } catch (err) {
        console.error(err);
    }
}
