#!/usr/bin/env node

const cla = require("command-line-args");
const fs = require("fs");
const { ModelBuilder } = require("./model_builder/ModelBuilder");
const { ModelFileParser } = require("./model_builder/ModelFileParser");
const { Sanitizer } = require("./model_builder/Sanitizer");
const { Table } = require("./model/Table");
const gtf = require("./model/translators/Generalizations/GeneralizationTranslatorFactory");
const rtf = require("./model/translators/Relations/TranslatorFactory");
const { ConsoleLogger } = require("./model/loggers/ConsoleLogger");

const option_definitions = [
  { name: "file", alias: "f", type: String },
  { name: "verbose", alias: "v", type: Boolean },
  { name: "save-file", alias: "s", type: String },
];

const options = cla(option_definitions);

const model_parser = new ModelFileParser(new ModelBuilder());
const sanitizer = new Sanitizer();

const input_file = fs.readFileSync(options.file, "utf-8");
let json_model = null;

if (!options.file.endsWith("json")) {
  const lines = sanitizer.sanitize_modelfile(input_file);
  json_model = model_parser.parse_model(lines).build_json();

  fs.writeFileSync("./build/diagram.json", JSON.stringify(json_model));
} else {
  json_model = JSON.parse(input_file);
}

let tables = json_model.structure.entities.map(
  (e) => new Table(e.name, e.key, e.attributes)
);

const gen_factory = gtf.default_factory;
const rel_factory = rtf.default_factory;

if (!options.verbose) {
  gen_factory.set_logger(null);
  rel_factory.set_logger(null);
}

// Resolve all generalizations
if (json_model.structure.generalizations) {
  for (let generalization of json_model.structure.generalizations) {
    const translator = gen_factory.get_translator(generalization, json_model);
    tables = translator.translate(tables, generalization, json_model);
  }
}

// Resolve all relations
if (json_model.structure.relations) {
  for (let relation of json_model.structure.relations) {
    const translator = rel_factory.get_translator(relation);
    tables = translator.translate(tables, relation);
  }
}

if (!options["save-file"]) {
  const logger = new ConsoleLogger();
  for (let table of tables) {
    logger.log(table.to_string());
  }
} else {
  const serialized = tables.map((t) => t.to_string()).join("\n");
  fs.writeFileSync(options["save-file"], serialized);
}
