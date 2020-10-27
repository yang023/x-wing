import moment from "moment";

const toMoment = (_val: string | Date | moment.Moment) => {
  if (typeof _val === "string") {
    return moment(new Date(_val));
  } else if (_val instanceof Date) {
    return moment(_val);
  }
  return _val;
};

export default toMoment;
