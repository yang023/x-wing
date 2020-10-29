import { FieldType } from "./types";
import { isArray } from "./utils";
import toMoment from "./components/toMoment";

type TransferType<T = any, R = any> = (value: T) => R;

const DefaultTransfer: TransferType<string | number, string | number> = value =>
  value;
const DatetimeTransfer: TransferType<
  string | Date | moment.Moment,
  moment.Moment
> = value => {
  return toMoment(value);
};
const ArrayTransfer: TransferType<
  string | number | string[] | number[],
  string[] | number[]
> = value => {
  const _val = {
    value: [] as string[] | number[]
  };
  if (isArray(value)) {
    _val.value = value as string[] | number[];
  }
  const _value = value as string | number;
  if (_value || _value === 0) {
    _val.value = [_value] as string[] | number[];
  } else {
    _val.value = [];
  }

  return _val.value;
};

const InputValueTransfers: {
  [key in FieldType]: TransferType;
} = {
  input: DefaultTransfer,
  password: DefaultTransfer,
  date: DatetimeTransfer,
  time: DatetimeTransfer,
  checkbox: ArrayTransfer,
  radio: DefaultTransfer,
  select: DefaultTransfer
};

const setTransfer = (type: FieldType, transfer: TransferType) => {
  InputValueTransfers[type] = transfer;
};

export { InputValueTransfers as Transfers, setTransfer };
