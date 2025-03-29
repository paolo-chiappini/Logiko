class GeneralizationTranslator {
  constructor() {
    this.logger = null;
  }
  match(generalization, diagram) {}

  set_logger(logger) {
    this.logger = logger;
  }
}

module.exports = { GeneralizationTranslator };
