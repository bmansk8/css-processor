import fs from "node:fs";
import config from "./config.json" assert { type: "json" };
import {
  ConfigValidatorFactory,
  CssClassCreatorFactory,
} from "./factories/index.js";

class CustomClassCreator {
  /**
   * @description A class used to create CSS files that have spacing/spacer utility classes
   * simply call the .main method to use this class
   * @param {Object} config json/object config used to set all params of the class. Such as filetype, spacers, options ect...
   * @param {string[]} config.file_types file types
   * @param {string } config.filename file name
   * @param {string[]} config.properties what css properties to make
   * @param {string[]} config.options include options like -left or -right
   * @param { {string : { string : string } } } config.spacers a object defining your spacers
   */
  constructor(config) {
    this.config = config;

    let { spacers, options, properties, filename, file_types } = this.config;

    this.spacers = spacers;
    this.options = options;
    this.fileValue = null;
    this.cssProperties = properties;
    this.filename = filename;
    this.file_types = file_types;
  }

  main() {
    const validConfig = this.validateConfig();

    if (!validConfig) return;

    this.file_types.forEach((file_type) => {
      this.createCustomClassFile(file_type);
    });
  }

  /**
   * validates config we are using
   * @returns {boolean} will return true if valid, and false if config is invalid
   */
  validateConfig() {
    try {
      let validator = ConfigValidatorFactory(this.config);
      validator.validateJsonConfig();
      return true;
    } catch (error) {
      console.log("\n ========= \n" + error.name + " -> ");
      console.log(error.message + "\n =========");
      return false;
    }
  }

  /**
   * @param {'json' | 'css' | 'scss'| 'less' | 'sass'} file_type - type of file to create.
   * @description This method creates a css file with css classes based on the config json file.
   * It can create classes for margin and or padding, at multiple breakpoints.
   */
  createCustomClassFile(file_type) {
    const cssCreator = CssClassCreatorFactory(
      {
        spacers: this.spacers,
        options: this.options,
        cssProperties: this.cssProperties,
      },
      file_type
    );

    Object.keys(this.spacers).forEach((key) => {
      this.cssProperties.forEach((cssProperty) => {
        this.fileValue = cssCreator.createClasses(key, cssProperty);
      });
    });

    fs.writeFile(`${this.filename}.${file_type}`, this.fileValue, (err) => {
      if (err) throw err;
      console.log(`Complete for ${file_type} file!`);
    });
  }
}

const customClassCreator = new CustomClassCreator(config);

customClassCreator.main();
