const cssShorthand = { margin: "m", padding: "p" };

class CssClassCreator {
  /**
   * @param {{}} spacers
   * @param {string[]} options
   * @param {string[]} cssProperties
   */
  constructor(spacers, options, cssProperties) {
    this.spacers = spacers;
    this.options = options;
    this.cssProperties = cssProperties;
    this.cssString = "";
  }

  /**
   * @param {string} key name of class/spacer
   * @param {string} cssAttribute css attribute to create classes for
   * @returns {string} returns a string version of the CSS classes that were created
   */
  createClasses(key, cssAttribute) {
    Object.keys(this.spacers[key]).forEach((breakpointKey) => {
      const cssAttributeShorthand = cssShorthand[cssAttribute];

      if (breakpointKey === "default") {
        this.cssString += this.createCssStringDefaultBreakpoint(
          cssAttribute,
          key,
          breakpointKey,
          cssAttributeShorthand
        );
      } else {
        this.cssString += this.createCssStringWithBreakpoint(
          cssAttribute,
          key,
          breakpointKey,
          cssAttributeShorthand
        );
      }
    });

    return this.cssString;
  }

  createCssStringWithBreakpoint(
    cssAttribute,
    key,
    breakpointKey,
    cssAttributeShorthand
  ) {
    let mediaQueryString = `\n@media(min-width: ${breakpointKey}) {\n`;

    this.options.forEach((option) => {
      const classValue = this.createCssClassValue(
        cssAttribute,
        option,
        this.spacers[key][breakpointKey]
      );

      mediaQueryString += `\n\t.${
        cssAttributeShorthand + option + "-" + key
      } {\n\t${classValue}\n\t}\n\t`;
    });

    mediaQueryString += "\n}\n";

    return mediaQueryString;
  }

  createCssStringDefaultBreakpoint(
    cssAttribute,
    key,
    breakpointKey,
    cssAttributeShorthand
  ) {
    let cssString = "";

    this.options.forEach((option) => {
      const classValue = this.createCssClassValue(
        cssAttribute,
        option,
        this.spacers[key][breakpointKey]
      );

      cssString += `\n.${
        cssAttributeShorthand + option + "-" + key
      } {\n${classValue}\n}\n`;
    });

    return cssString;
  }

  /**
   * @param {string} cssAttribute css attribute we are setting
   * @param {string} option option like -left or -right
   * @param {string} value value of css attribute
   * @returns {string} returns a CSS class string with any needed values
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

export { CssClassCreator };
