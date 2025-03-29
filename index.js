const fs = require("fs");
const { Table } = require("./model/Table");
const relation_translator = require("./model/translators/Relations/TranslatorFactory");
const generalization_translator = require("./model/translators/Generalizations/GeneralizationTranslatorFactory");

let tables = [];

const diagram = JSON.parse(fs.readFileSync("diagram.json", "utf-8"));

tables = tables.concat(
  diagram.structure.entities.map((e) => new Table(e.name, e.key, e.attributes))
);

if (diagram.structure.generalizations) {
  for (let generalization of diagram.structure.generalizations) {
    const translator = generalization_translator.default_factory.get_translator(
      generalization,
      diagram
    );
    tables = translator.translate(tables, generalization, diagram);
  }
}

for (let relation of diagram.structure.relations) {
  const translator =
    relation_translator.default_factory.get_translator(relation);
  tables = translator.translate(tables, relation);
}

for (let table of tables) {
  console.log(table.to_string());
}
