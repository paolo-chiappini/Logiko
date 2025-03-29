const { Translator } = require("./Translator");

class OneToManyTranslator extends Translator {
  constructor() {
    super(null, "1", null, "N");
  }

  match(relation) {
    return (
      (this.from_max == relation.from.cardinality.max &&
        this.to_max == relation.to.cardinality.max) ||
      (this.to_max == relation.from.cardinality.max &&
        this.from_max == relation.to.cardinality.max)
    );
  }

  translate(tables, relation) {
    const from_entity = tables.find((t) => t.name == relation.from.entity);
    const to_entity = tables.find((t) => t.name == relation.to.entity);

    if (relation.from.cardinality.max == 1) {
      from_entity.add_foreign_keys(to_entity.key);
    } else {
      to_entity.add_foreign_keys(from_entity.key);
    }

    return tables;
  }
}

module.exports = { OneToManyTranslator };
