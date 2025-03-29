const { OneToOneTranslator } = require("./OneToOneTranslator");
const { OneToManyTranslator } = require("./OneToManyTranslator");
const { ManyToManyTranslator } = require("./ManyToManyTranslator");
const { ConsoleLogger } = require("../../loggers/ConsoleLogger");

class RelationTranslatorFactory {
  constructor(translators, logger) {
    this.translators = translators;
    this.logger = logger;

    this.translators.forEach((t) => {
      t.set_logger(logger);
    });
  }

  get_translator(relation) {
    return this.translators.filter((t) => t.match(relation))[0];
  }
}

module.exports = {
  RelationTranslatorFactory,
  default_factory: new RelationTranslatorFactory(
    [
      new OneToOneTranslator(),
      new OneToManyTranslator(),
      new ManyToManyTranslator(),
    ],
    new ConsoleLogger()
  ),
};
