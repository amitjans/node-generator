const fs = require('fs');

function controller (obj) {
    let content = "const " + obj.name + " = require('../models/" + obj.name + "');\n";
    content += "const " + obj.name.toLowerCase() + "controller = {};\n\n";

    content += obj.name.toLowerCase() + "controller.index = " + index(obj.name)
    content += "\n";
    content += obj.name.toLowerCase() + "controller.details = " + details(obj.name);
    content += "\n";
    content += obj.name.toLowerCase() + "controller.create = " + create(obj.name);
    content += "\n";
    content += obj.name.toLowerCase() + "controller.edit = " + edit(obj.name);
    content += "\n";
    content += obj.name.toLowerCase() + "controller.delete = " + remove(obj.name);
    content += "\n";
    content += "module.exports = " + obj.name.toLowerCase() + "controller;";

    try {
        if (!fs.existsSync('./proyecto/src')) {
            fs.mkdir('./proyecto/src/controllers', { recursive: true }, (err) => {
                fs.writeFileSync('./proyecto/src/controllers/' + obj.name.toLowerCase() + '.controller.js', content, { mode: 0o777 });
                if (err) throw err;
            });
        }
    } catch (err) {
        console.error(err);
    }
}

function index(name) {
    let temp = `\t\tconst list = await ${name}.find();\n` +
    `\t\tres.status(200).json(list);\n`;
    return "async (req, res) => {\n" +
        trycatch(temp, name, 'retriving') +
        `}\n`;
}

function details(name) {
    return "async (req, res) => {\n" +
        `\tconst { id } = req.params;\n` +
        `\tconst ${name.toLowerCase()} = await ${name}.findById(id);\n` +
        `\tif (!${name.toLowerCase()}) {\n` +
        "\t\treturn res.status(404).json({ message: `" + name + " with id ${id} does not exists` })\n" +
        "\t}\n" +
        `\tres.json(${name.toLowerCase()});\n` +
        "}\n";
}

function create(name) {
    let temp = `\t\tconst ${name.toLowerCase()} = new ${name}(req.body);\n` +
    `\t\tres.status(200).json(await ${name.toLowerCase()}.save());\n`;

    return "async (req, res) => {\n" +
        trycatch(temp, name, 'saving') +
        `}\n`;
}

function edit(name) {
    return `async (req, res) => {\n` +
        trycatch(`\t\tres.json(await ${name}.findByIdAndUpdate(req.params.id, req.body));\n`, name, 'editing') +
        `}\n`;
}

function remove (name) {
    let temp = `await ${name}.findByIdAndDelete(req.params.id);\n` +
    `res.json({ message: "${name} were deleted successfully" });\n`;

    return `async (req, res) => {\n` +
        trycatch(temp, name, 'deleting') +
        `}\n`;
}

function trycatch(inside, name, message, code = '500') {
    return `\ttry {\n` +
    inside +
    `\t} catch (error) {\n` +
    `\t\tres.status(${code}).json({\n` +
    `\t\t\tmessage: error.message || 'Something goes wrong ${message} the ${name.toLowerCase()}'\n` +
    `\t\t})\n` +
    `\t}\n`
}

module.exports = {
    controller,
    index,
    details,
    create,
    edit,
    remove
}
