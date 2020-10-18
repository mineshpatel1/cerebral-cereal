export class Validators {
  constructor() {}

  /** Validate using multiple validation functions */
  static validate(val, validators) {
    let error = true;
    for (let vFn of validators) {
      if (!error) break;
      error = vFn(val);
    }
    return error;
  }

  static isInteger = val => {
    return !isNaN(parseInt(val));
  }

  static isNumber = val => {
    return !isNaN(val);
  }

  static gtZero = val => {
    return val >= 0;
  }

  static minValue = minVal => {
    return val => val >= minVal;
  }

  static maxValue = maxVal => {
    return val => val <= maxVal;
  }

  static required = (val) => {
    return !(!val);
  }
}
