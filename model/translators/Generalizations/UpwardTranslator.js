const { GeneralizationTranslator } = require("./GeneralizationTranslator");

class UpwardTranslator extends GeneralizationTranslator {
  constructor() {
    super();
  }

  match(decision_summary) {
    // Check if parent has any relations
    if (decision_summary.parent_relations.relations.length < 1) return false;
    // Check how many distinct entities are pointed by the children
    if (Object.keys(decision_summary.pointed_entities).length > 1) return false;

    return true;
  }

  translate(tables, generalization, diagram) {
    const parent_table_index = tables.findIndex(
      (t) => t.name == generalization.parent
    );

    this.logger?.log(
      `Translating [${generalization.children}] upward in parent [${generalization.parent}]`
    );

    if (generalization.exclusivity == "e") {
      const attr_name = tables[parent_table_index].name + "_type";
      tables[parent_table_index].add_attributes(attr_name);

      this.logger?.log(`Adding [${attr_name}] to parent to differentiate type`);
    }

    for (let child of generalization.children) {
      const child_table_index = tables.findIndex((t) => t.name == child);
      tables[parent_table_index].merge(tables[child_table_index]);
      tables.splice(child_table_index, 1);
      this.logger?.log(
        `Removing generalized entity [${child}], adding attributes to parent [${generalization.parent}]`
      );

      for (let relation of diagram.structure.relations) {
        if (relation.from.entity == child) {
          this.logger?.log(
            `Replacing [${child}] in relation [${relation.name}] with parent [${generalization.parent}]`
          );
          relation.from.entity = generalization.parent;
        } else if (relation.to.entity == child) {
          this.logger?.log(
            `Replacing [${child}] in relation [${relation.name}] with parent [${generalization.parent}]`
          );
          relation.to.entity = generalization.parent;
        }
      }
    }

    return tables;
  }
}

module.exports = { UpwardTranslator };
