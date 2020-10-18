export class ColourUtils {
  constructor() {}
  
  /** Lighten or darken a colour given by a Hex value. */
  static alterBrightness = (col, amt) => {
    let usePound = false;
    
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
  
    let num = parseInt(col, 16);
  
    let r = (num >> 16) + amt;
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
  
    let b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
  
    let g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    if (r == 0 && b == 0 && g == 0) return '#000000';
    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
  }

  /** Returns true if the colour is a dark colour, false if bright. */
  static isDark = (colour) => {
    const rgb = this.colourToRGBObj(colour);  // Convert colour to RGB
    
    // HSP equation from http://alienryderflex.com/hsp.html
    const hsp = Math.sqrt(
      0.299 * (rgb.r * rgb.r) +
      0.587 * (rgb.g * rgb.g) +
      0.114 * (rgb.b * rgb.b)
    );

    // Using the HSP value, determine whether the color is light or dark
    return hsp < 127.5;
  }

  /** Converts a Hex colour to rgb object: {r, g, b}. */
  static colourToRGBObj = (rgba) => {
    if (rgba.startsWith('#')) rgba = this.hexToRgba(rgba);
    const result = /[rgba|rgb]\((\d*),\s(\d*),\s(\d*),/.exec(rgba);
    if (result) {
      return {
        r: parseInt(result[1]),
        g: parseInt(result[2]),
        b: parseInt(result[3]),
      };
    }
  }

  /** Converts a Hex colour to rgba string */
  static hexToRgba = (hex, a=1) => {
      if (hex.startsWith('rgb')) return hex;
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (result) {
        let r = parseInt(result[1], 16).toString();
        let g = parseInt(result[2], 16).toString();
        let b = parseInt(result[3], 16).toString();
        return 'rgba(' + r +', ' + g + ', ' + b + ', ' + a.toString() + ')';
      }
  }

  /** Converts an RGB value to a hex string */
  static rgbToHex = (r, g, b) => {
    const componentToHex = c => {
      const hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  /** Given two colours and an opacity value, computers the new colour. */
  static genOpacityColour = (foreground, background, opacity, a=1) => {
    const rgbF = this.colourToRGBObj(foreground);
    const rgbB = this.colourToRGBObj(background);

    const r = Math.round(((1 - opacity) * rgbB.r) + (opacity * rgbF.r));
    const g = Math.round(((1 - opacity) * rgbB.g) + (opacity * rgbF.g));
    const b = Math.round(((1 - opacity) * rgbB.b) + (opacity * rgbF.b));
    return 'rgba(' + r.toString() +', ' + g.toString() + ', ' + b.toString() + ', ' + a.toString() + ')';
  }
}
