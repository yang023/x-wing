import { RuleItem } from "async-validator";
import { Subject } from "rxjs";

// 工具类型
export type Connect<T1, T2> = T1 & T2;

export type PlainData = {
  [key: string]: any;
};

export type NestedData = PlainData & {
  [key: string]: PlainData;
};

export type FormData<T = NestedData> = Partial<T>;

// 配置

export type RequiredFieldProps = {
  name: string;
};
export type DefaultFieldProps = {
  type: FieldType;
  rules: RuleItem | RuleItem[];
  defaultValue: any;
  valueFormat: string; // it's name is the default
  sourceFormat: string; // it's name is the default
};
export type DisplayFieldProps = {
  label: string;
  tips: string;
  eumns: FieldEumnItem[];
};

export type FieldProps = Required<RequiredFieldProps> &
  Partial<DefaultFieldProps & DisplayFieldProps>;

export type FormProps = {
  id: string;
  fields: FieldProps[];
};

// 事件中心

export type EventType<> = {
  event: string;
  payload: any;
};

export interface EventsCore {
  readonly events: Subject<EventType>;

  bind<E>(key: string, handler: (e: E) => void): () => void;
  emit<E>(key: string, e: E): void;
}

// 状态机类型

export type StateType = {
  [key: string]: boolean;
};

export interface StateCore<R extends StateType, C extends StateType> {
  readonly state: Connect<R, C>;
  setReadonlyState(_state: Partial<R>): void;
  setChangeableState(_state: Partial<C>): void;
  getState(): Connect<R, C>;
  specify(key: keyof Connect<R, C>): R[keyof R] | C[keyof C];
}

// 字段类型

export type FieldType =
  | "input"
  | "password"
  | "select"
  | "radio"
  | "checkbox"
  | "date"
  | "time"
  | "datetime";

export type ReadonlyFieldState = {
  changing: boolean;
  error: boolean;
};

export type ChangeableFieldState = {
  disabled: boolean;
  editable: boolean;
  visibled: boolean;
};

export type FieldState = Connect<ReadonlyFieldState, ChangeableFieldState>;

export interface FieldCore {
  readonly name: string;
  readonly type: FieldType;
  readonly rules: RuleItem | RuleItem[];
  valueFormat: string;
  sourceFormat: string;
  value: any;
  initialValue?: any;

  readonly display: Partial<FieldDisplay>;

  readonly state: StateCore<ReadonlyFieldState, ChangeableFieldState>;

  setValue: (_value: any) => void;
  resetValue: () => void;
  setInitialValue: (_value: any) => void;

  setDisplay(display: Partial<FieldDisplay>): void;

  getState(): Connect<ReadonlyFieldState, ChangeableFieldState>;
  specify(
    key: keyof Connect<ReadonlyFieldState, ChangeableFieldState>
  ):
    | ReadonlyFieldState[keyof ReadonlyFieldState]
    | ChangeableFieldState[keyof ChangeableFieldState];

  validate(callback: (error?: string) => void): void;
  clearValidation(): void;
}

export type FieldEumnItem = {
  title: string;
  value: string | string[] | boolean;
  disabled?: boolean;
};

export type FieldDisplay = {
  label: string;
  tips: string;
  errors: string;
  eumns: FieldEumnItem[];
};

// 表单类型

export type ReadonlyFormState = {
  loading: boolean;
  submitting: boolean;
};

export type ChangeableFormState = {
  disabled: boolean;
  editable: boolean;
};

export type FormValidationResult = { [key: string]: any };

export type FormState = Connect<ReadonlyFormState, ChangeableFormState>;

export interface FormCore<T = NestedData> {
  readonly id: string;
  readonly data: FormData<T>;

  readonly state: StateCore<ReadonlyFormState, ChangeableFormState>;
  readonly fields: FieldCore[];

  addField(field: FieldCore, parent?: FieldCore): void;
  getField(name: string): FieldCore | null;
  getFields(key: string): FieldCore[];

  setData(resolve: (loader: (_data: FormData<T>) => void) => void): void;
  resetData(): void; // set default
  clearData(): void;
  initializeData(resolve: (loader: (_data: FormData<T>) => void) => void): void;

  validate(callback: (errors: FormValidationResult) => void): void;
  clearValidation(): void;
}
