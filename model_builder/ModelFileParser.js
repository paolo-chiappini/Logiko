const title_template = /^title:.*/i;
const comment_template = /^#.*/;
const relation_template = /\[.*\]\-.*\-\[.*\]/;
const entity_template = /\[.*?\]/;
const cardinality_template = /\((0|1|N),(0|1|N)\)/i;
const generalization_template = /<-\((t|p),(o|s|e)\)-/i;

const key_option = "-k";
const attr_option = "-a";
const key_option_regex = new RegExp(`${key_option}`);
const attr_option_regex = new RegExp(`${attr_option}`);

const cardinality_regex = new RegExp(cardinality_template, "g");

class ModelFileParser {
  constructor(model_builder) {
    this.builder = model_builder;
  }

  line_type(line) {
    if (comment_template.test(line)) return "comment";
    if (title_template.test(line)) return "title";
    if (relation_template.test(line)) return "relation";
    if (generalization_template.test(line)) return "generalization";
    if (entity_template.test(line)) return "entity";
    throw new Error(`Unrecognized syntax "${line}"`);
  }

  get_keys(line) {
    if (!key_option_regex.test(line)) return; // No keys
    if (!attr_option_regex.test(line)) {
      return line
        .substring(line.indexOf(key_option) + key_option.length)
        .replace(/\s/g, "")
        .split(",");
    } else {
      return line
        .substring(
          line.indexOf(key_option) + key_option.length,
          line.indexOf(attr_option)
        )
        .replace(/\s/g, "")
        .split(",");
    }
  }

  get_attrs(line) {
    if (!attr_option_regex.test(line)) return; // No attrs
    return line
      .substring(line.indexOf(attr_option) + attr_option.length)
      .replace(/\s/g, "")
      .split(",");
  }

  get_cardinality(line) {
    if (!cardinality_template.test(line)) return;
    const matches = [...line.toUpperCase().matchAll(cardinality_regex)];
    if (matches.length !== 2) {
      throw new Error(
        `Found ${matches.length} matches in "${line}", only exactly 2 are allowed`
      );
    }
    return {
      from: { min: matches[0][1], max: matches[0][2] },
      to: { min: matches[1][1], max: matches[1][2] },
    };
  }

  get_entities(line) {
    const entities = line.match(new RegExp(entity_template, "g"));
    return entities.map((entity) => entity.replace(/\[|\]/g, ""));
  }

  get_relation_name(line) {
    const first_card = line.indexOf(")");
    const second_card = line.indexOf("(", first_card);
    return line.substring(first_card + 1, second_card).replace(/-/g, "");
  }

  get_generalization_type(line) {
    const elements = line
      .match(/\(.*\)/)[0]
      .replace(/\(|\)/g, "")
      .split(",");
    return {
      coverage: elements[0],
      exclusivity: elements[1],
    };
  }

  parse_model(lines) {
    for (const line of lines) {
      switch (this.line_type(line)) {
        case "title":
          this.builder.set_title(line.replace("title:", "").trim());
          break;
        case "entity":
          this.builder.add_entity(
            this.get_entities(line)[0],
            this.get_keys(line),
            this.get_attrs(line)
          );
          break;
        case "relation":
          this.builder.add_relation(
            this.get_relation_name(line),
            this.get_entities(line),
            this.get_cardinality(line),
            this.get_keys(line),
            this.get_attrs(line)
          );
          break;
        case "generalization":
          const entities = this.get_entities(line);
          this.builder.add_generalization(
            entities[0],
            entities.slice(1),
            this.get_generalization_type(line)
          );
        default:
      }
    }
    return this.builder;
  }
}

module.exports = { ModelFileParser };
