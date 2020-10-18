import { Path } from "cool-path";
import {
  ChangeableFormState,
  FieldCore,
  FormCore,
  FormData,
  FormValidationResult,
  ReadonlyFormState,
  StateCore
} from "../types";
import State from "./State";

class Form<T> implements FormCore<T> {
  readonly id: string;
  readonly data: FormData<T>;
  readonly state: StateCore<ReadonlyFormState, ChangeableFormState>;
  readonly fields: FieldCore[];
  constructor(
    id: string,
    state?: StateCore<ReadonlyFormState, ChangeableFormState>
  ) {
    this.id = id;
    this.data = {};
    this.state = state
      ? state
      : new State<ReadonlyFormState, ChangeableFormState>(
          { loading: false, submitting: false },
          { disabled: false, editable: true }
        );
    this.fields = [];
  }

  addField(field: FieldCore): void {
    this.fields.push(field);
  }
  getField(name: string) {
    for (const field of this.fields) {
      if (field.name === name) {
        return field;
      }
    }
    return null;
  }
  getFields(key: string) {
    return this.fields.filter(field => new Path(field.name).match(key));
  }

  setData(resolve: (loader: (_data: FormData<T>) => void) => void) {
    this.state.setReadonlyState({ loading: true });

    resolve(data => {
      this.resolveValue(
        data,
        (field, value) => field.setValue(value),
        () => this.state.setReadonlyState({ loading: false })
      );
    });
  }
  resetData() {
    this.getFields("*").forEach(field => {
      field.resetValue();
      field.clearValidation();
    });
  }
  clearData() {
    this.getFields("*").forEach(field => {
      field.setValue(undefined);
      field.clearValidation();
    });
  }
  initializeData(resolve: (loader: (_data: FormData<T>) => void) => void) {
    this.state.setReadonlyState({ loading: true });

    resolve(data => {
      this.resolveValue(
        data,
        (field, value) => {
          field.setInitialValue(value);
        },
        () => {
          this.state.setReadonlyState({ loading: false });
        }
      );
    });
  }

  validate(callback: (errors: FormValidationResult) => void) {
    const errors = this.getFields("*").reduce((errors, field) => {
      field.validate(error => {
        if (error) {
          errors[field.name] = error;
        }
      });
      return errors;
    }, {} as FormValidationResult);

    callback(errors);
  }

  clearValidation() {
    this.getFields("*").forEach(field => field.clearValidation());
  }

  private resolveValue(
    _data: FormData<T>,
    setter: (field: FieldCore, value: any) => void,
    callback: () => void
  ) {
    this.getFields("*").forEach(field => {
      setter(field, Path.getIn(_data, field.sourceFormat));
    });

    callback();
  }
}

export default Form;
