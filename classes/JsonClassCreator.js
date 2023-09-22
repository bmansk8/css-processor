const cssShorthand = { margin: "m", padding: "p" };

class JsonClassCreator {
  /**
   * @param {{}} spacers
   * @param {string[]} options
   * @param {string[]} cssProperties
   */
  constructor(spacers, options, cssProperties) {
    this.spacers = spacers;
    this.options = options;
    this.cssProperties = cssProperties;
    this.json = {};
  }

  /**
   * @param {string} key name of class/spacer
   * @param {string} cssAttribute css attribute to create classes for
   * @returns {Object} returns an object version of whatever CSS classes were created
   */
  createClasses(key, cssAttribute) {
    const cssAttributeShorthand = cssShorthand[cssAttribute];

    Object.keys(this.spacers[key]).forEach((breakpointKey) => {
      let spacer = this.spacers[key][breakpointKey];

      this.options.forEach((option) => {
        if (option === "-y" || option === "-x") {
          this.handleOptions(
            cssAttributeShorthand,
            option,
            key,
            cssAttribute,
            spacer,
            breakpointKey
          );
        } else {
          this.addToJson(
            cssAttributeShorthand,
            option,
            key,
            cssAttribute,
            spacer,
            breakpointKey
          );
        }
      });
    });

    return JSON.stringify(this.json);
  }

  addToJson(
    cssAttributeShorthand,
    option,
    key,
    cssAttribute,
    spacer,
    breakpointKey
  ) {
    const className = `.${cssAttributeShorthand}${option}-${key}`;
    const classDefinition = {
      ...(breakpointKey === "default" && {
        [cssAttribute + option]: spacer,
      }),
      ...(breakpointKey !== "default" && {
        [`@media (min-width: ${breakpointKey})`]: {
          [cssAttribute + option]: spacer,
        },
      }),
    };

    this.json = {
      ...this.json,
      [className]: { ...this.json?.[className], ...classDefinition },
    };
  }

  handleOptions(
    cssAttributeShorthand,
    option,
    key,
    cssAttribute,
    spacer,
    breakpointKey
  ) {
    const className = `.${cssAttributeShorthand}${option}-${key}`;
    const classDefinition = {};
    let newClassObject = {};

    if (option === "-y") {
      classDefinition[cssAttribute + "-top"] = spacer;
      classDefinition[cssAttribute + "-bottom"] = spacer;
    } else if (option === "-x") {
      classDefinition[cssAttribute + "-left"] = spacer;
      classDefinition[cssAttribute + "-right"] = spacer;
    }

    if (breakpointKey !== "default") {
      newClassObject[`@media (min-width: ${breakpointKey})`] = {
        ...classDefinition,
      };
    } else {
      newClassObject = { ...classDefinition };
    }

    this.json = {
      ...this.json,
      [className]: { ...this.json?.[className], ...newClassObject },
    };
  }
}

export { JsonClassCreator };
