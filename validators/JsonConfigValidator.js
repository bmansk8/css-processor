import { JsonValidationError } from "../errors/index.js";
import { validOptions, validFileTypes } from "../constants/index.js";

/**
 * @description Validator used to validate config json for the CSS tool. Assume the following default structure
 * @param {object} config config object to validate
 */
class JsonConfigValidator {
  constructor(config) {
    this.config = config;
  }

  validateJsonConfig() {
    this.validateProperties();
    this.validateOptions();
    this.validateSpacers();
    this.validateFileTypes();
  }

  validateFileTypes() {
    if (
      this.config?.file_types?.length == 0 ||
      this.config.file_types == undefined
    ) {
      throw new JsonValidationError("file_types in json is null or empty");
    }

    this.config.file_types.forEach((file_type) => {
      if (!validFileTypes.includes(file_type)) {
        throw new JsonValidationError(
          "file_type is not valid, must be " + validFileTypes
        );
      }
    });
  }

  /**
   * Validates the properties in the configuration object.
   * @throws {JsonValidationError} Throws an error if the properties are null, empty,
   * or not 'margin' or 'padding'.
   */
  validateProperties() {
    if (
      this.config?.properties?.length == 0 ||
      this.config.properties == undefined
    ) {
      throw new JsonValidationError("properties in json is null or empty");
    }

    this.config.properties.forEach((property) => {
      if (
        /^margin$/g.test(property) != true &&
        /^padding$/g.test(property) != true
      ) {
        throw new JsonValidationError(
          "properties in json must be 'margin' or 'padding'"
        );
      }
    });
  }

  /**
   * Validates the options in the configuration object.
   * @throws {JsonValidationError} Throws an error if the options are null, empty, or not valid.
   */
  validateOptions() {
    if (this.config?.options?.length == 0 || this.config.options == undefined) {
      throw new JsonValidationError(
        "options must not empty or missing from json"
      );
    }

    this.config.options.forEach((option) => {
      if (!validOptions.includes(option)) {
        throw new JsonValidationError(
          "option is not valid, must be " + validOptions
        );
      }
    });
  }

  /**
   * Validates the spacers configuration object.
   * @throws {JsonValidationError} Throws an error if spacers are null, empty,
   * or do not meet the specified format requirements.
   */
  validateSpacers() {
    if (
      Object.keys(this.config.spacers).length == 0 ||
      this.config.spacers == undefined
    ) {
      throw new JsonValidationError(
        "spacers must not empty or missing from json"
      );
    }

    Object.keys(this.config.spacers).forEach((spacerKey) => {
      let currentSpacer = this.config.spacers[spacerKey];

      if (Object.keys(currentSpacer).includes("default") == false) {
        throw new JsonValidationError("spacer must have a 'default' option");
      }

      Object.keys(currentSpacer).forEach((spacerBreakpointKey) => {
        if (typeof currentSpacer[spacerBreakpointKey] != "string") {
          throw new JsonValidationError(`
spacer breakpoint value must have px at the end of the string \n
valid exmaple:
"spacers": {
    "L": {
        "default": "22px",
    }
}\n
invalid exmaple:
"spacers": {
    "L": {
        "default": 22,
    }
}
            `);
        }

        if (/px$/g.test(currentSpacer[spacerBreakpointKey]) != true) {
          throw new JsonValidationError(`
spacer breakpoint value must have px at the end of the string \n
valid exmaple:
"spacers": {
    "L": {
        "default": "22px",
    }
}
            `);
        }
      });
    });
  }
}

export { JsonConfigValidator };
