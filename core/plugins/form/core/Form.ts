import { Path } from "cool-path";
import {
  ChangeableFormState,
  FieldCore,
  FieldGroup,
  FormCore,
  FormData,
  FormLayout,
  FormValidationResult,
  GridUiType,
  ReadonlyFormState,
  StateCore
} from "../types";
import State from "./State";

type FormConfig = {
  groups: string | FieldGroup[];
  ui: Partial<{
    layout: "horizontal" | "vertical" | "inline";
    itemLabelCol: GridUiType;
    itemWrapperCol: GridUiType;
    itemGrid: GridUiType;
  }>;
};

class Form<T> implements FormCore<T> {
  readonly id: string;
  readonly data: FormData<T>;
  readonly state: StateCore<ReadonlyFormState, ChangeableFormState>;
  readonly fields: FieldCore[];

  readonly layout: FormLayout;
  readonly groups: FieldGroup[];

  readonly itemLayout: {
    labelCol: GridUiType;
    wrapperCol: GridUiType;
  };
  readonly itemGrid: GridUiType;

  constructor(
    id: string,
    config?: Partial<FormConfig>,
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

    const { groups = "default", ui } = config || {};
    const { layout = "inline", itemLabelCol, itemWrapperCol, itemGrid } =
      ui || {};
    this.layout = layout || "inline";
    if (typeof groups === "string") {
      this.groups = [{ name: groups, title: "" }];
    } else {
      this.groups = [...groups];
    }
    this.itemLayout = {
      labelCol: itemLabelCol as GridUiType,
      wrapperCol: itemWrapperCol as GridUiType
    };
    this.itemGrid = itemGrid as GridUiType;
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
