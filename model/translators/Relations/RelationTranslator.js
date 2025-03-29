class RelationTranslator {
  constructor(from_min, from_max, to_min, to_max) {
    this.from_min = from_min;
    this.from_max = from_max;
    this.to_min = to_min;
    this.to_max = to_max;
    this.logger = null;
  }

  match(relation) {
    return (
      this.from_min == relation.from.cardinality.min &&
      this.from_max == relation.from.cardinality.max &&
      this.to_min == relation.to.cardinality.min &&
      this.to_max == relation.to.cardinality.max
    );
  }

  set_logger(logger) {
    this.logger = logger;
  }
}

module.exports = { RelationTranslator };
