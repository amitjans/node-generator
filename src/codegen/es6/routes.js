const fs = require('fs');

module.exports.routes = (obj, babel) => {
    let objname = obj.name.toLowerCase() + 's';

    let content = (!!babel ? "import {Router} from 'express'\nconst router = Router()" : "const express = require('express');\nconst router = express.Router();") + ";\n";
    content += "\n";
    content += (!!babel ? "import * as " + objname + "Ctrl from \"../controllers/tasks.controller\";" : "const " + objname + " = require('../controllers/script.controller');") + "\n";
    content += "\n";

    content += "router.get('/', " + objname + "Ctrl.findAll);\n";
    content += "router.get('/:id', " + objname + "Ctrl.findOne);\n";
    content += "router.post('/', " + objname + "Ctrl.create);\n";
    content += "router.put('/:id', " + objname + "Ctrl.update);\n";
    content += "router.delete('/:id', " + objname + "Ctrl.delete);\n";
    content += "\n";
    content += "export default router;";

    try {
        if (!fs.existsSync('./proyecto/src/routes')) {
            fs.mkdirSync('./proyecto/src/routes');
        }
        fs.writeFileSync('./proyecto/routes/' + obj.name.toLowerCase() + '.routes.js', content, { mode: 0o777 });
    } catch (err) {
        console.error(err);
    }
}
