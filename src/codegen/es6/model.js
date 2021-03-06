const fs = require('fs');

module.exports.model = (obj, babel, paginate) => {
    let content = (!!babel ? "import {Schema, model} from 'mongoose'" : "const mongoose = require('mongoose');\nconst { Schema } = mongoose") + ";\n";
    if (!!paginate) {
        content +=  (!!babel ? "import mongoosePaginate from \"mongoose-paginate-v2\"" : "const { mongoosePaginate } = require('mongoose-paginate-v2')") + ";\n";
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
    content += !!babel 
    ? "export default model('" + obj.name + "', " + obj.name. toLowerCase() + "Schema);" 
    : "module.exports = mongoose.model('" + obj.name + "', " + obj.name. toLowerCase() + "Schema);";

    try {
        if (!fs.existsSync('./proyecto/src/model')){
            fs.mkdirSync('./proyecto/src/model');
        }
        fs.writeFileSync('./proyecto/model/' + obj.name + '.js', content, { mode: 0o777 });
      } catch(err) {
        console.error(err);
      }
}
