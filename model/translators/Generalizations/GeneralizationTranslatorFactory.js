const { DownwardTranslator } = require("./DownwardTranslator");
const { HybridTranslator } = require("./HybridTranslator");
const { UpwardTranslator } = require("./UpwardTranslator");
const { ConsoleLogger } = require("../../loggers/ConsoleLogger");

class GeneralizationTranslatorFactory {
  constructor(translators, logger) {
    this.translators = translators;
    this.logger = logger;

    this.translators.forEach((t) => {
      t.set_logger(logger);
    });
  }

  get_translator(generalization, diagram) {
    const decision_summary = compute_decision_summary(generalization, diagram);
    const translator = this.translators.filter((t) =>
      t.match(decision_summary)
    )[0];
    if (!translator)
      throw new Error(`Cannot translate "${JSON.stringify(generalization)}"`);
    return translator;
  }
}

function compute_decision_summary(generalization, diagram) {
  const parent = generalization.parent;
  const children = generalization.children;

  const parent_relations = diagram.structure.relations.filter(
    (r) => r.from.entity == parent || r.to.entity == parent
  );

  const pointed_entities = {};
  const children_relations = {};
  for (let child of children) {
    const relations = diagram.structure.relations.filter(
      (r) => r.from.entity == child || r.to.entity == child
    );
    children_relations[child] = {
      relations: relations,
      count: relations.length,
    };

    for (let relation of children_relations[child].relations) {
      if (!pointed_entities[relation.from.entity]) {
        pointed_entities[relation.from.entity] = 0;
      }
      if (!pointed_entities[relation.to.entity]) {
        pointed_entities[relation.to.entity] = 0;
      }
      pointed_entities[relation.from.entity]++;
      pointed_entities[relation.to.entity]++;
    }
  }

  for (let child of children) {
    delete pointed_entities[child];
  }

  const decision_summary = {
    parent_relations: {
      relations: parent_relations,
      count: parent_relations.length,
    },
    children_relations: children_relations,
    pointed_entities: pointed_entities,
  };

  return decision_summary;
}

module.exports = {
  GeneralizationTranslatorFactory,
  default_factory: new GeneralizationTranslatorFactory(
    [new UpwardTranslator(), new DownwardTranslator(), new HybridTranslator()],
    new ConsoleLogger()
  ),
};
