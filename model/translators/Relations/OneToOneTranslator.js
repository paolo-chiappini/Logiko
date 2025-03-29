const { Translator } = require("./Translator");

class OneToOneTranslator extends Translator {
  constructor() {
    super(null, "1", null, "1");
  }

  match(relation) {
    return (
      this.from_max == relation.from.cardinality.max &&
      this.to_max == relation.to.cardinality.max
    );
  }

  translate(tables, relation) {
    const from_entity = tables.find((t) => t.name == relation.from.entity);
    const to_entity = tables.find((t) => t.name == relation.to.entity);

    if (relation.from.cardinality.min == 0) {
      to_entity.add_foreign_keys(from_entity.key);
    } else {
      // Indiffirent where the fk goes, as policy, choose always the "from entity"
      from_entity.add_foreign_keys(to_entity.key);
    }

    return tables;
  }
}

module.exports = { OneToOneTranslator };
