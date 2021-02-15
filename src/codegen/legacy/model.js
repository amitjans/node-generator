const fs = require('fs');

module.exports.model = (obj, paginate) => {
    let content = "const mongoose = require('mongoose');\nconst { Schema } = mongoose;\n";
    if (!!paginate) {
        content += "const { mongoosePaginate } = require('mongoose-paginate-v2');\n";
    }
    content += "\n";
    content += "const " + obj.name. toLowerCase() + "Schema = new Schema({\n";
    for (let i = 0; i < obj.property.length; i++) {
        content += "\t" + obj.property[i].name + ": { type: " + obj.property[i].type;
        if (obj.property[i].type === 'String') {
            content += ", required: true, trim: true";
        } else if (obj.property[i].type === 'Boolean'){
            content += ", default: false";
        }
        content += " }" + ((obj.property.length -1 != i) ? "," : "") + "\n";
    }
    content += "}, {\n";
    content += "\tversionKey: " + obj.versionKey + ",\n";
    content += "\ttimestamps: " + obj.timestamps + "\n";
    content += "});\n";
    content += "\n";
    if (!!paginate) {
        content += "taskSchema.plugin(mongoosePaginate);\n";
    }  
    content += "module.exports = mongoose.model('" + obj.name + "', " + obj.name. toLowerCase() + "Schema);";

    try {
        if (!fs.existsSync('./proyecto/src')) {
            fs.mkdir('./proyecto/src/model', { recursive: true }, (err) => {
                fs.writeFileSync('./proyecto/src/model/' + obj.name + '.js', content, { mode: 0o777 });
                if (err) throw err;
            });
        }
      } catch(err) {
        console.error(err);
      }
}
