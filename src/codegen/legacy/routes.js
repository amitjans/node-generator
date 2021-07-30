const fs = require('fs');

module.exports.routes = (obj) => {
    let objname = obj.name.toLowerCase() + 's';

    let content = "const express = require('express');\nconst router = express.Router();\n";
    content += "\n";
    content += "const " + objname + " = require('../controllers/" + obj.name.toLowerCase() + ".controller');\n";
    content += "\n";

    content += "router.get('/', " + objname + ".index);\n";
    content += "router.get('/:id', " + objname + ".details);\n";
    content += "router.post('/', " + objname + ".create);\n";
    content += "router.put('/:id', " + objname + ".edit);\n";
    content += "router.delete('/:id', " + objname + ".delete);\n";
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
