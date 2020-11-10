import { Animated, Appearance, Easing } from 'react-native';
import isEqual from 'lodash.isequal';

const _typeOf = value => {
  var s = typeof value;
  if (s === 'object') {
    if (value) {
      if (value instanceof Array) s = 'array';
    } else s = 'null';
  }
  return s;
}

const _padInt = (int, len=2) => {
  return int.toString().padStart(len, '0');
}

/** Creates a copy of any Object. */
const _clone = (_orig) => {
  if (_typeOf(_orig) == 'object') {
    return Object.assign( Object.create( Object.getPrototypeOf(_orig)), _orig);
  } else if (_typeOf(_orig) == 'array') {
    return _orig.slice(0);
  }
}

export class Utils {
  constructor() {}

  /** Rounds to two decimal places. */
  static round = num => {
    return Math.round(100 * (num + Number.EPSILON)) / 100;
  }

  /** Returns current UNIX timestamp. */
  static now = () => {
    return Math.ceil(Date.now() / 1000);
  }

  /**
  Gets the index of an object array based on the value of a given key.
  */
  static indexOfArray = (_array, _key, val) => {
    return _array.map((x) => x[_key]).indexOf(val);
  }

  /** Removes a specific element from array by value. */
  static removeFromArray = (_array, val) => {
    if (_array.indexOf(val) == -1 ) return _array;
    _array.splice(_array.indexOf(val), 1);
    return _array;
  }

  /** Returns a unique array from a non-unique array. */
  static unique = (_array) => {
    return [...new Set(_array)];
  }

  /** Returns string as Title Case. */
  static titleCase = str => {
    let words = [];
    str.toLowerCase().split(' ').forEach(s => {
      words = words.concat(s.split('_'));
    });
    return words.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(' ');
  }

  /** LoDash's object equality comparator. */
  static isEqual = (obj1, obj2) => {
    return isEqual(obj1, obj2);
  }

  /** Returns true if an object is empty. */
  static isEmpty = obj => {
    if (!obj) return true;
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  /** Returns element of an array with the largest value of a given key. */
  static maxBy = (_array, _key) => {
    return _array.reduce((prev, current) => {
      return (prev[_key] > current[_key]) ? prev : current;
    });
  }

  /** Returns element of an array with the largest value of a given key. */
  static minBy = (_array, _key) => {
    return _array.reduce((prev, current) => {
      return (prev[_key] < current[_key]) ? prev : current;
    });
  }

  /**
  Shuffles an array, randomising the order of elements in an array using
  the Fisher-Yates method.
  */
  static shuffle = (array) => {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  /** Creates a copy of any Object. */
  static clone = (_orig) => {
    return _clone(_orig);
  }

  /** Updates an old object with a new one, returning a completely new Object. */
  static update = (prev, next) => {
    return Object.assign({}, prev, next);
  }

  /** Parses a value given an expected type. E.g. Turns a string to a number or vice versa. */
  static parseValue = (val, type) => {
    if (!val) return val;
    switch(type) {
      case 'string':
        return val.toString();
      case 'int':
        val = parseInt(val);
        if (isNaN(val)) val = null;
        return val;
      case 'number':
        val = Number(val);
        if (isNaN(val)) val = null;
        return val;
      case 'bool':
        return Boolean(val);
    }
  }

  /** Sorts an array of objects by the value of a specific key. */
  static sortByKey = (_array, _key, asc=true) => {
    let new_array = [];
    let multiplier = asc ? 1 : -1;

    for (let _obj of _array) {
      new_array.push(_clone(_obj));
    }

    return new_array.sort(function(a, b){
      if (a[_key] < b[_key]) return multiplier * -1;
      if (a[_key] > b[_key]) return multiplier * 1;
      if (a[_key] == b[_key]) return 0;
    });
  }

  /**
  Formats an integer value of seconds into minutes and seconds with seconds
  zero-padded.
  */
  static formatSeconds = (ms) => {
    let s = ms;
    let mins = Math.floor(s / 60).toString();
    let secs = (s - (mins * 60)).toString();

    if (parseInt(secs) < 10) {
      secs = '0' + secs;
    }

    return mins + ':' + secs;
  }

  /** Returns an array of incremented integers of length n. */
  static sequence = (n) => {
    return Array.apply(null, {length: n}).map(Function.call, Number);
  }

  /** Converts polar coordinates to Cartesian coordinates. */
  static polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }
  
  /** Equivalent of the map function, for objects. */
  static mapObject = (obj, fn) => {
    return Object.fromEntries(
      Object.entries(obj).map(
        ([k, v], i) => [k, fn(v, k, i)]
      )
    );
  }
  

  /** Generic animation function. */
  static animate = (
    value, toValue,
    {
      duration=null,
      native=true,
      callback=null,
      easing=Easing.ease,
      delay=0,
    }
  ) => {
    if (!duration && duration != 0) duration = 300;
    Animated.timing(
      value,
      {
        toValue: toValue,
        duration: duration,
        easing: easing,
        delay: delay,
        useNativeDriver: native,
      }
    ).start(callback);
  }

  // Returns dark or light depending on the Dark Mode value, defaulting to the system
  // setting if necessary.
  static appearanceMode = colourTheme => {
    if (!colourTheme) return Appearance.getColorScheme();
    const _colourTheme = colourTheme.toLowerCase();
    return _colourTheme.startsWith('system') ? Appearance.getColorScheme() : _colourTheme;
  }

  // Takes an amount of microseconds and displays it in 00:00:00 format.
  static displayTime = mSeconds => {
    let _seconds = Math.round(mSeconds / 1000);
    let seconds = _seconds % 60;
    let minutes = Math.floor(_seconds / 60);
    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    return _padInt(hours) + ':' + _padInt(minutes) + ':' + _padInt(seconds);
  }

  // Levehnstein Distance between two strings
  // https://gist.github.com/andrei-m/982927
  static getEditDistance = function(a, b){
    if(a.length == 0) return b.length; 
    if(b.length == 0) return a.length; 
  
    var matrix = [];
  
    // increment along the first column of each row
    var i;
    for(i = 0; i <= b.length; i++){
      matrix[i] = [i];
    }
  
    // increment each column in the first row
    var j;
    for(j = 0; j <= a.length; j++){
      matrix[0][j] = j;
    }
  
    // Fill in the rest of the matrix
    for(i = 1; i <= b.length; i++){
      for(j = 1; j <= a.length; j++){
        if(b.charAt(i-1) == a.charAt(j-1)){
          matrix[i][j] = matrix[i-1][j-1];
        } else {
          matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                  Math.min(matrix[i][j-1] + 1, // insertion
                                           matrix[i-1][j] + 1)); // deletion
        }
      }
    }
  
    return matrix[b.length][a.length];
  };

  /** Standard GET method for contacting the server. */
  static genGet = serverUrl => {
    return async (path) => {
      const url = serverUrl + '/' + path;
      return fetch(url, { method: 'GET', credentials: 'include' })
        .then(res => res.json());
    }
  }

  /** Standard POST method for contacting the server. */
  static genPost = serverUrl => {
    return async (path, data) => {
      const url = serverUrl + '/' + path;
      return fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then(res => res.json())
    }
  }

  /** Standard DELETE method for contacting the server. */
  static genDelete = serverUrl => {
    return async (path) => {
      const url = serverUrl + '/' + path;
      return fetch(url, {
        method: 'DELETE',
        credentials: 'include',
      }).then(res => res.json());
    }
  }
}
