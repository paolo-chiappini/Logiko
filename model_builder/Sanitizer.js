class Sanitizer {
  constructor() {}

  sanitize_modelfile(input) {
    const collapsed = input.replace(/[ \t]+/g, " ");

    return collapsed
      .split("\n")
      .map((l) => l.trim())
      .filter((line) => line !== "");
  }
}

module.exports = { Sanitizer };
