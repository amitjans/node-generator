const fs = require('fs');

module.exports.routes = (obj, babel) => {
    let objname = obj.name.toLowerCase() + 's';

    let content = (!!babel ? "import {Router} from 'express'\nconst router = Router()" : "const express = require('express');\nconst router = express.Router();") + ";\n";
    content += "\n";
    content += (!!babel ? "import * as " + objname + "Ctrl from \"../controllers/tasks.controller\";" : "const " + objname + " = require('../controllers/script.controller');") + "\n";
    content += "\n";

    content += obj.name.toLowerCase() + "controller.index = "
    content += "\n";
    content += obj.name.toLowerCase() + "controller.details = " + details(obj.name);
    content += "\n";
    content += obj.name.toLowerCase() + "controller.create = " + create(obj.name);
    content += "\n";
    content += obj.name.toLowerCase() + "controller.edit = " + edit(obj.name);
    content += "\n";
    content += obj.name.toLowerCase() + "controller.delete = " + remove(obj.name);
    content += "\n";

    content += (!!babel ? "" : "module.exports = tipobicicontroller;");

    try {
        if (!fs.existsSync('./proyecto/src/controllers')) {
            fs.mkdirSync('./proyecto/src/controllers', { recursive: true });
        }
        fs.writeFileSync('./proyecto/src/controllers/' + obj.name.toLowerCase() + '.controller.js', content, { mode: 0o777 });
    } catch (err) {
        console.error(err);
    }
}

function index(name) {
    let temp = `\t\tconst new${name.toLowerCase()} = new ${name}();\n` +
    `\t\tconst ${name.toLowerCase()}Saved = await new${name.toLowerCase()}.save();\n` +
    `\t\tres.status(200).json(${name.toLowerCase()});\n`;

    return "async (req, res) => {\n" +
        trycatch(temp, name, 'saving') +
        `\t}\n`;
}

function details(name) {
    return "async (req, res) => {" +
        `\tconst { id } = req.params;\n` +
        `\tconst ${name.toLowerCase()} = await ${name}.findById(id);\n` +
        `\tif (!task) {\n` +
        "\t\treturn res.status(404).json({ message: `" + name + " with id ${id} does not exists` })\n" +
        "\t}\n" +
        "\tres.json(task);\n";
}

function create(name) {
    let temp = `\t\tconst new${name.toLowerCase()} = new ${name}();\n` +
    `\t\tconst ${name.toLowerCase()}Saved = await new${name.toLowerCase()}.save();\n` +
    `\t\tres.status(200).json(${name.toLowerCase()});\n`;

    return "async (req, res) => {\n" +
        trycatch(temp, name, 'saving') +
        `\t}\n`;
}

function edit(name) {
    return `async (req, res) => {\n` +
        trycatch(`\t\tres.json(await Task.findByIdAndUpdate(req.params.id, req.body));\n`, name, editing) +
        `\t}\n`;
}

function remove (name) {
    let temp = `await Task.findByIdAndDelete(req.params.id);\n` +
    `res.json({ message: "Task were deleted successfully" });\n`;

    return `async (req, res) => {\n` +
        trycatch(temp, name, 'deleting') +
        `};\n` +
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
