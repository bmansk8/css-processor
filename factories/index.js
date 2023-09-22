import { JsonConfigValidator } from "../validators/JsonConfigValidator.js";
import { CssClassCreator, JsonClassCreator, ScssClassCreator } from "../classes/index.js";

/**
 * Factory function that creates a new instance of `JsonConfigValidator` with the provided configuration.
 *
 * @param {Object} config - The configuration object to be validated.
 * @returns {JsonConfigValidator} An instance of JsonConfigValidator configured with the provided data.
 */
function ConfigValidatorFactory(config) {
  return new JsonConfigValidator(config);
}

/**
 * @param {{spacers: {},options: string[],cssProperties: string[]}} config - The configuration object to be validated.
 * @param {'css' | 'json' | 'scss' | 'less'} fileType - what kind of file we are trying to make. Json, or CSS file for example
 * @returns {Class} An instance of a class that has a createClasses method.
 */
function CssClassCreatorFactory(config, fileType) {
  const factoryMapper = createFactoryMapperObject(config);

  return factoryMapper[fileType]();
}

/**
 * Creates a factory mapper object that provides functions to create instances of class creators.
 *
 * @param {Object} config - The configuration object.
 * @param {Object} config.spacers - The spacers configuration for the class creators.
 * @param {String[]} config.options - The options configuration for the class creators.
 * @param {String[]} config.cssProperties - The CSS properties configuration for the class creators.
 * @returns {Object} A factory mapper object with methods to create class creator instances.
 */
function createFactoryMapperObject(config) {
  return {
    css: () =>
      new CssClassCreator(config.spacers, config.options, config.cssProperties),
    json: () =>
      new JsonClassCreator(
        config.spacers,
        config.options,
        config.cssProperties
      ),
    scss: () =>
      new ScssClassCreator(
        config.spacers,
        config.options,
        config.cssProperties
      ),
    less: () =>
      new ScssClassCreator(
        config.spacers,
        config.options,
        config.cssProperties
      ),
  };
}

export { ConfigValidatorFactory, CssClassCreatorFactory };
