const { RelationTranslator } = require("./RelationTranslator");
const { Table } = require("../../Table");

class ManyToManyTranslator extends RelationTranslator {
  constructor() {
    super(null, "N", null, "N");
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

    const combined_keys = from_entity.key.concat(to_entity.key);
    const bridge_table = new Table(
      `${from_entity.name}_${to_entity.name}`,
      combined_keys,
      relation.attributes
    );

    this.logger?.log(`Created bridge table ${bridge_table.name}`);

    if (relation.key) {
      bridge_table.add_keys(relation.key);
      this.logger?.log(
        `Adding to key of ${bridge_table.name} the combination of ${combined_keys}`
      );
    }

    bridge_table.add_foreign_keys(combined_keys);
    this.logger?.log(`Set ${bridge_table.name}'s FK ${combined_keys}`);

    return tables.concat(bridge_table);
  }
}

module.exports = { ManyToManyTranslator };
