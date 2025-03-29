const { RelationTranslator } = require("./RelationTranslator");

class OneToOneTranslator extends RelationTranslator {
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

    let absorbing_entity = null;
    let absorbed_entity = null;

    if (relation.from.cardinality.min == 0) {
      absorbed_entity = to_entity;
      absorbing_entity = from_entity;
      this.logger?.log(
        `Adding FK of ${from_entity.name} to ${to_entity.name} (translation towards mandatory participation entity of min carindality 1)`
      );
    } else {
      absorbed_entity = from_entity;
      absorbing_entity = to_entity;
      this.logger?.log(`Adding FK of ${to_entity.name} to ${from_entity.name}`);
    }

    absorbing_entity.add_foreign_keys(absorbed_entity.key);
    this.logger?.log(
      `Adding FK of ${absorbed_entity.name} to ${absorbing_entity.name} (translation towards max cardinality 1)`
    );

    if (relation.attributes) {
      absorbing_entity.add_attributes(relation.attributes);
      this.logger?.log(
        `Adding attributes of relation ${relation.name} to ${absorbing_entity.name} (same direction as FK)`
      );
    }

    return tables;
  }
}

module.exports = { OneToOneTranslator };
