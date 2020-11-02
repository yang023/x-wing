import Schema, { RuleItem } from "async-validator";
import {
  ChangeableFieldState,
  FieldCore,
  FieldDisplay,
  FieldProps,
  FieldType,
  GridUiType,
  ReadonlyFieldState,
  StateCore
} from "../types.d";
import State from "./State";

class Field implements FieldCore {
  readonly name: string;
  readonly type: FieldType;
  readonly rules: RuleItem | RuleItem[];
  readonly state: StateCore<ReadonlyFieldState, ChangeableFieldState>;
  readonly display: Required<FieldDisplay>;
  readonly valueFormat: string;
  readonly sourceFormat: string;
  readonly link?: string;
  readonly group: string;
  readonly ui: {
    labelCol: GridUiType;
    wrapperCol: GridUiType;
  };
  value: any;
  initialValue: any;

  constructor(
    props: FieldProps,
    state?: StateCore<ReadonlyFieldState, ChangeableFieldState>
  ) {
    this.name = props.name;
    this.type = props.type || "input";
    this.group = props.group || "default";
    this.rules = props.rules as RuleItem | RuleItem[];
    this.valueFormat = props.valueFormat || props.name;
    this.sourceFormat = props.sourceFormat || props.name;
    this.link = props.link;
    this.ui = {
      labelCol: props.labelCol || ((null as unknown) as GridUiType),
      wrapperCol: props.wrapperCol || ((null as unknown) as GridUiType)
    };

    this.display = {
      label: props.label || "",
      eumns: props.eumns || [],
      tips: props.tips || "",
      errors: "",
      disabledDate: () => false,
      disabledTime: () => false
    };

    const _value = props.defaultValue;
    this.value = _value;
    this.initialValue = _value;

    this.state = state
      ? state
      : new State<ReadonlyFieldState, ChangeableFieldState>(
          { changing: false, error: false },
          { editable: true, disabled: false, visibled: true }
        );
  }

  setDisplay(display: Partial<FieldDisplay>) {
    Object.assign(this.display, display);
  }
  setValue(_value: any) {
    this.value = _value;
  }
  resetValue() {
    this.setValue(this.initialValue);
  }
  setInitialValue(_value: any) {
    this.initialValue = _value;
  }
  getState() {
    return this.state.getState();
  }
  specify(key: keyof (ReadonlyFieldState & ChangeableFieldState)) {
    return this.state.specify(key);
  }

  validate(callback: (error?: string) => void) {
    if (!this.rules) {
      callback(undefined);
      return;
    }
    const validator = new Schema({
      [this.name]: this.rules
    });

    validator.validate({ [this.name]: this.value }, { first: true }, errors => {
      if (errors == null || errors == undefined) {
        errors = [];
      }
      this.state.setReadonlyState({
        error: !!errors[0]?.message
      });

      this.setDisplay({
        errors: errors[0]?.message || ""
      });
      callback(errors[0]?.message);
    });
  }

  clearValidation() {
    this.setDisplay({
      errors: ""
    });
    this.state.setReadonlyState({ error: false });
  }
}

export default Field;
