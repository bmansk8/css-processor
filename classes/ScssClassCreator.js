const cssShorthand = { margin: "m", padding: "p" };

class ScssClassCreator {
  /**
   * @param {{}} spacers
   * @param {String[]} options
   * @param {String[]} cssProperties
   */
  constructor(spacers, options, cssProperties) {
    this.spacers = spacers;
    this.options = options;
    this.cssProperties = cssProperties;
    this.cssString = "";
  }

  /**
   * @param {String} key name of class/spacer
   * @param {String} cssAttribute css attribute to create classes for
   * @returns {String} returns a string version of the CSS classes that were created
   */
  createClasses(key, cssAttribute) {
    const cssAttributeShorthand = cssShorthand[cssAttribute];

    this.options.forEach((option) => {
      Object.keys(this.spacers[key]).forEach((breakpointKey) => {
        if (breakpointKey === "default") {
          this.cssString += this.createCssStringDefaultBreakpoint(
            option,
            cssAttribute,
            key,
            breakpointKey,
            cssAttributeShorthand
          );
        } else {
          this.cssString += this.createCssStringWithBreakpoint(
            option,
            cssAttribute,
            key,
            breakpointKey
          );
        }
      });

      this.cssString += "}\n";
    });

    return this.cssString;
  }

  createCssStringWithBreakpoint(option, cssAttribute, key, breakpointKey) {
    let mediaQueryString = `\n\t@media(min-width: ${breakpointKey}) {`;

    const classValue = this.createCssClassValue(
      cssAttribute,
      option,
      this.spacers[key][breakpointKey]
    );

    mediaQueryString += `\n\t${classValue}`;

    mediaQueryString += "\n\t}\n";

    return mediaQueryString;
  }

  createCssStringDefaultBreakpoint(
    option,
    cssAttribute,
    key,
    breakpointKey,
    cssAttributeShorthand
  ) {
    let cssString = "";

    const classValue = this.createCssClassValue(
      cssAttribute,
      option,
      this.spacers[key][breakpointKey]
    );

    cssString += `\n.${
      cssAttributeShorthand + option + "-" + key
    } {\n${classValue}\n`;

    return cssString;
  }

  /**
   * @param {String} cssAttribute css attribute we are setting
   * @param {String} option option like -left or -right
   * @param {String} value value of css attribute
   * @returns {String} returns a CSS class string with any needed values
   */
  createCssClassValue(cssAttribute, option, value) {
    if (option === "-x") {
      return `\t${cssAttribute}-left: ${value}; ${cssAttribute}-right: ${value};`;
    } else if (option === "-y") {
      return `\t${cssAttribute}-bottom: ${value}; ${cssAttribute}-top: ${value};`;
    } else {
      return `\t${cssAttribute + option}: ${value};`;
    }
  }
}

export { ScssClassCreator };
