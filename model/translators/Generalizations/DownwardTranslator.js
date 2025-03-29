const { GeneralizationTranslator } = require("./GeneralizationTranslator");

class DownwardTranslator extends GeneralizationTranslator {
  constructor() {
    super();
  }

  match(decision_summary) {
    // Check if parent has relations
    if (decision_summary.parent_relations.relations.length > 0) return false;
    return true;
  }

  translate(tables, generalization, diagram) {
    const parent_table_index = tables.findIndex(
      (t) => t.name == generalization.parent
    );

    this.logger?.log(
      `Translating [${generalization.parent}] downward to children [${generalization.children}]`
    );

    for (let child of generalization.children) {
      const child_table_index = tables.findIndex((t) => t.name == child);
      tables[child_table_index].merge(tables[parent_table_index]);
      this.logger?.log(
        `Cloning attributes of parent [${generalization.parent}] to child [${child}]`
      );
    }
    tables.splice(parent_table_index, 1);
    this.logger?.log(`Removing generalized entity [${generalization.parent}]`);

    return tables;
  }
}

module.exports = { DownwardTranslator };
