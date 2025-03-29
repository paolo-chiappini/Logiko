class ModelBuilder {
  constructor() {
    this.title = "Diagram";
    this.entities = new Set();
    this.relations = new Set();
    this.generalizations = new Set();
  }

  set_title(title) {
    this.title = title;
    return this;
  }

  add_entity(name, key, attributes) {
    this.entities.add({
      name: name,
      key: key ?? [],
      attributes: attributes ?? [],
    });
    return this;
  }

  add_relation(name, entities, cardinality, key, attributes) {
    this.relations.add({
      name: name,
      from: {
        entity: entities[0],
        cardinality: {
          min: cardinality.from.min,
          max: cardinality.from.max,
        },
      },
      to: {
        entity: entities[1],
        cardinality: {
          min: cardinality.to.min,
          max: cardinality.to.max,
        },
      },
      key: key,
      attributes: attributes,
    });
    return this;
  }

  add_generalization(parent, children, type) {
    this.generalizations.add({
      parent: parent,
      children: children,
      coverage: type.coverage,
      exclusivity: type.exclusivity,
    });
    return this;
  }

  build_json() {
    return {
      name: this.title,
      structure: {
        entities: [...this.entities],
        relations: [...this.relations],
        generalizations: [...this.generalizations],
      },
    };
  }
}

module.exports = { ModelBuilder };
