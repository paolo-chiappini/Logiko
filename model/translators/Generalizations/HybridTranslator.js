const { GeneralizationTranslator } = require("./GeneralizationTranslator");

class HybridTranslator extends GeneralizationTranslator {
  constructor() {
    super();
  }

  match(decision_summary) {
    // Default policy, everything works
    return true;
  }

  translate(tables, generalization, diagram) {
    const parent_table_index = tables.findIndex(
      (t) => t.name == generalization.parent
    );

    console.dir(tables);

    this.logger?.log(
      `Translating [${generalization.parent}] and [${generalization.children}] in an hybrid way`
    );

    for (let child of generalization.children) {
      const child_table_index = tables.findIndex((t) => t.name == child);
      tables[child_table_index].add_keys(tables[parent_table_index].key);
      tables[child_table_index].add_foreign_keys(
        tables[parent_table_index].key
      );

      this.logger?.log(
        `Adding keys of parent [${generalization.parent}] to child [${child}]`
      );
    }

    return tables;
  }
}

module.exports = { HybridTranslator };
