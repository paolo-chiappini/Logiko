const { OneToOneTranslator } = require("./OneToOneTranslator");
const { OneToManyTranslator } = require("./OneToManyTranslator");
const { ManyToManyTranslator } = require("./ManyToManyTranslator");
const { ConsoleLogger } = require("../../loggers/ConsoleLogger");

class RelationTranslatorFactory {
  constructor(translators, logger) {
    this.translators = translators;
    this.logger = logger;

    this.set_logger(logger);
  }

  set_logger(logger) {
    this.translators.forEach((t) => {
      t.set_logger(logger);
    });
  }

  get_translator(relation) {
    const translator = this.translators.filter((t) => t.match(relation))[0];
    if (!translator)
      throw new Error(`Cannot translate "${JSON.stringify(relation)}"`);
    return translator;
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
    new ConsoleLogger("gray")
  ),
};
