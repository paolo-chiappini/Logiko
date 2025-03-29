const chalk = require("chalk");

class Table {
  constructor(name, key, attributes) {
    this.name = name;
    this.key = key ?? [];
    this.attributes = attributes ?? [];
    this.foreign_keys = [];
  }

  to_string() {
    const keys = this.key.map((k) =>
      chalk.underline(this.foreign_keys.includes(k) ? k + "*" : k)
    );
    const other_fks = this.foreign_keys
      .filter((fk) => !this.key.includes(fk))
      .map((fk) => fk + "*");
    const attr_list = keys.concat(this.attributes).concat(other_fks).join(", ");
    return `${this.name} (${attr_list})`;
  }

  add_keys(keys) {
    this.key = this.key.concat(keys);
  }

  add_attributes(attributes) {
    this.attributes = this.attributes.concat(attributes);
  }

  add_foreign_keys(foreign_keys) {
    this.foreign_keys = this.foreign_keys.concat(foreign_keys);
  }

  merge(table) {
    this.key = this.key.concat(table.key);
    this.foreign_keys = this.foreign_keys.concat(table.foreign_keys);
    this.attributes = this.attributes.concat(table.attributes);
  }
}

module.exports = { Table };
