const { RelationTranslator } = require("./RelationTranslator");

class OneToManyTranslator extends RelationTranslator {
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

    let absorbing_entity = null;
    let absorbed_entity = null;

    if (relation.from.cardinality.max == 1) {
      absorbed_entity = to_entity;
      absorbing_entity = from_entity;
    } else {
      absorbed_entity = from_entity;
      absorbing_entity = to_entity;
    }

    absorbing_entity.add_foreign_keys(absorbed_entity.key);
    this.logger?.log(
      `Adding FK of ${absorbed_entity.name} to ${absorbing_entity.name} (translation towards max cardinality 1)`
    );

    if (relation.attributes) {
      absorbing_entity.add_attributes(relation.attributes);
      this.logger?.log(
        `Adding attributes of relation ${relation.name} to ${absorbing_entity.name} (translation towards max cardinality 1)`
      );
    }

    return tables;
  }
}

module.exports = { OneToManyTranslator };
