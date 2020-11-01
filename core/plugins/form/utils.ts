enum TypeMap {
  Object = "[object Object]",
  Number = "[object Number]",
  String = "[object String]",
  Boolean = "[object Boolean]",
  Array = "[object Array]",
  Function = "[object Function]"
}

const is = (_source: any, type: TypeMap) => {
  return Object.prototype.toString.call(_source) === type.toString();
};

const isObject = (_source: any) => is(_source, TypeMap.Object);
const isNumber = (_source: any) => is(_source, TypeMap.Number);
const isString = (_source: any) => is(_source, TypeMap.String);
const isBoolean = (_source: any) => is(_source, TypeMap.Boolean);
const isArray = (_source: any) => is(_source, TypeMap.Array);
const isFunction = (_source: any) => is(_source, TypeMap.Function);

const isExist = (value: any) => value !== null && value !== undefined;

export {
  isObject,
  isNumber,
  isString,
  isBoolean,
  isArray,
  isFunction,
  isExist
};
