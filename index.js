const fs = require("fs");
const { Table } = require("./model/Table");
const { default_factory } = require("./model/translators/TranslatorFactory");

let tables = [];

const diagram = JSON.parse(fs.readFileSync("diagram.json", "utf-8"));

tables = tables.concat(
  diagram.structure.entities.map((e) => new Table(e.name, e.key, e.attributes))
);

for (let relation of diagram.structure.relations) {
  translator = default_factory.get_translator(relation);
  tables = translator.translate(tables, relation);
}

for (let table of tables) {
  console.log(table.to_string());
}
