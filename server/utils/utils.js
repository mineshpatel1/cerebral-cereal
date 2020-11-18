const colours = require('colors/safe');

const AUTH_ERROR = 'Not logged in.';

const _typeOf = value => {
  var s = typeof value;
  if (s === 'object') {
    if (value) {
      if (value instanceof Array) s = 'array';
    } else s = 'null';
  }
  return s;
}

/** Formats a Date as YYYY-MM-DD */
formatDate = date => {
  let dt = new Date(date);
  let month = (dt.getMonth() + 1).toString().padStart(2, '0');
  let day = dt.getDate().toString().padStart(2, '0');
  let year = dt.getFullYear();
  return [year, month, day].join('-');
}

/** Formats time as HH:MM:SS */
formatTime = time => {
  let t = new Date(time);
  let h = (t.getHours().toString().padStart(2, '0'));
  let m = (t.getMinutes().toString().padStart(2, '0'));
  let s = (t.getSeconds().toString().padStart(2, '0'));
  return [h, m, s].join(':');
}

/** Formats log message */
formatLog = (msg, level) => {
  let dt = new Date();
  let dtStr = formatDate(dt);
  dtStr += ' ' + formatTime(dt);

  let _level = level.toUpperCase().padEnd(5);
  let _method = 'log';
  switch (level) {
    case 'debug':
      _level = colours.grey(_level);
      _method = 'debug';
    case 'info':
      _level = colours.white(_level);
      break;
    case 'warn':
      _level = colours.yellow(_level);
      _method = 'warn';
      break;
    case 'error':
      _level = colours.red(_level);
      _method = 'error';
      break;
  }
  console[_method]('[' + _level + '][' + dtStr + '] ' + msg);
}

/** Creates a copy of any Object. */
exports.clone = (_orig) => {
  if (_typeOf(_orig) == 'object') {
    return Object.assign( Object.create( Object.getPrototypeOf(_orig)), _orig);
  } else if (_typeOf(_orig) == 'array') {
    return _orig.slice(0);
  }
}

/** Returns the current time in UTC seconds. */
exports.now = () => {
  return Math.ceil(Date.now() / 1000);
}

exports.log = {
  info: msg => formatLog(msg, 'info'),
  warning: msg => formatLog(msg, 'warn'),
  error: msg => formatLog(msg, 'error'),
};
