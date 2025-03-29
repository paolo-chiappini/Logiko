const { OneToOneTranslator } = require("./OneToOneTranslator");
const { OneToManyTranslator } = require("./OneToManyTranslator");
const { ManyToManyTranslator } = require("./ManyToManyTranslator");

class RelationTranslatorFactory {
  constructor(translators) {
    this.translators = translators;
  }

  get_translator(relation) {
    return this.translators.filter((t) => t.match(relation))[0];
  }
}

module.exports = {
  RelationTranslatorFactory,
  default_factory: new RelationTranslatorFactory([
    new OneToOneTranslator(),
    new OneToManyTranslator(),
    new ManyToManyTranslator(),
  ]),
};
