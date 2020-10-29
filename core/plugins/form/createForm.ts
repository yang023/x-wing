import createProxy from "./createProxy";
import { Subject } from "rxjs";
import { Path } from "cool-path";
import Form from "./core/Form";
import Field from "./core/Field";
import State from "./core/State";
import { FieldEvents, FormEvents } from "./events";
import {
  ChangeableFieldState,
  ChangeableFormState,
  FieldDisplay,
  FormProps,
  FormData,
  StateType,
  ReadonlyFormState,
  ReadonlyFieldState,
  FormState,
  FieldState,
  FormCore
} from "./types";
import { Transfers } from "./transfer";

type EventType<T = any> = {
  event: string;
  payload: T;
};

const events = new Subject<EventType>();

/**
 * 监听事件, 主要为自定义事件监听
 * @param key 事件名称
 * @param handler 事件回调
 */
const onEvent = <T>(key: string | RegExp, handler: (payload: T) => void) => {
  const stop = events.subscribe(({ event, payload }) => {
    let matched = false;
    if (key instanceof RegExp) {
      matched = key.test(event);
    } else {
      matched = Path.parse(key).match(event);
      if (!matched) {
        matched = new RegExp(key).test(event);
      }
    }
    if (matched) {
      handler(payload);
    }
  });
  return () => stop.unsubscribe();
};

/**
 * 触发表单事件, 提供自定义事件触发机制
 * @param key 事件名称
 * @param payload 事件载荷
 */
const emitFormEvent = (key: string, payload: any) => {
  key.startsWith("form.") && (key = key.replace("form.", ""));
  events.next({
    event: `form.${key}`,
    payload
  });
};

/**
 * 触发字段事件, 提供自定义事件触发机制
 * @param key 事件名称
 * @param payload 事件载荷
 */
const emitFieldEvent = (key: string, payload: any) => {
  key.startsWith("field.") && (key = key.replace("field.", ""));
  events.next({
    event: `field.${key}`,
    payload
  });
};

/**
 * 表单值变更事件监听器
 * @param handler 表单值修改后回调
 */
const onFormValueChange = <T>(handler: (payload: FormData<T>) => void) => {
  return onEvent(FormEvents.valueChange(), handler);
};
/**
 * 表单状态变更事件监听器
 * @param state 状态名称
 * @param handler 状态变更后回调
 */
const onFormStateChange = <T extends FormState>(
  state: keyof T | "*",
  handler: (payload: { name: string; state: T[keyof T] }) => void
) => {
  return onEvent(FormEvents.stateChange(state), handler);
};

/**
 * 字段值变更事件监听器
 * @param key 字段匹配符
 * @param handler 字段值变更后回调
 */
const onFieldValueChange = <T = any, L = any>(
  key: string,
  handler: (payload: { name: string; value?: T; link?: L }) => void
) => {
  return onEvent(FieldEvents.valueChange(key), handler);
};
/**
 * 字段状态变更事件监听器
 * @param key 字段匹配符
 * @param state 状态名称
 * @param handler 字段状态变更后回调
 */
const onFieldStateChange = <T extends FieldState>(
  key: string,
  state: keyof T | "*",
  handler: (payload: { name: string; state: T[keyof T] }) => void
) => {
  return onEvent(FieldEvents.stateChange(key, state), handler);
};
/**
 * 字段控件选项变更事件监听器
 * @param key 字段匹配符
 * @param state 控件选项名称
 * @param handler 字段控件选项变更后回调
 */
const onFieldOptionChange = <T extends FieldDisplay>(
  key: string,
  type: keyof T | "*",
  handler: (payload: { name: string; option: Partial<T> }) => void
) => {
  return onEvent(FieldEvents.optionChange(key, type), handler);
};

/**
 * 表单驱动创建器
 * @param config 表单配置
 */
const createForm = <T = any>(config: FormProps) => {
  /**
   * 状态变更方法代理创建器
   * @param fieldName 字段名，不为空触发“表单状态变更事件”，否则触发“字段变更事件”
   */
  const createState = <R extends StateType, C extends StateType>(
    r: R,
    c: C,
    fieldName?: string
  ) => {
    const setState = <
      R extends StateType,
      C extends StateType,
      T extends R | C
    >(
      fieldName?: string
    ) => {
      return (_set: (s: Partial<T>) => void, target: State<R, C>) => {
        return (state: T) => {
          Object.keys(state).forEach(key => {
            const payload = {
              name: key,
              state: state[key]
            };
            fieldName
              ? emitFieldEvent(FieldEvents.stateChange(fieldName, key), payload)
              : emitFormEvent(FormEvents.stateChange(key), payload);
          });
          return _set.call(target, state);
        };
      };
    };
    const state = new State<R, C>(r, c);
    return createProxy(state, {
      setReadonlyState: setState<R, C, R>(fieldName),
      setChangeableState: setState<R, C, C>(fieldName)
    });
  };

  const { id, fields } = config;
  const $formState = createState<ReadonlyFormState, ChangeableFormState>(
    { loading: false, submitting: false },
    { disabled: false, editable: true }
  );
  const _form = new Form(id, $formState);

  const form = createProxy((_form as unknown) as FormCore<T>, {
    addField: (_addField, target) => {
      return field => {
        emitFieldEvent(FieldEvents.registered(field), field);
        return _addField.call(target, field);
      };
    },
    setData: (_setData, target) => {
      return resolve => {
        return _setData.call(target, loader => {
          resolve.call(target, data => {
            loader.call(target, data);
            emitFormEvent(FormEvents.valueChange(), target.data);
          });
        });
      };
    }
  });

  onFieldValueChange("*", ({ name, value }) => {
    const field = form.getField(name);

    if (!field) {
      return;
    }
    Path.setIn(form.data, field.valueFormat, value);
    emitFormEvent(FormEvents.valueChange(), _form.data);
  });

  fields.forEach(props => {
    const $fieldState = createState<ReadonlyFieldState, ChangeableFieldState>(
      { changing: false, error: false },
      { editable: true, disabled: false, visibled: true },
      props.name
    );

    props.type = props.type || "input";
    // 通过 Transfer 工具对入参进行转换
    if (props.defaultValue !== null || props.defaultValue !== undefined) {
      props.defaultValue = Transfers[props.type](props.defaultValue);
    }

    const field = new Field(props, $fieldState);
    // 若存在默认值, 对表单数据进行设置
    if (field.value !== null || field.value !== undefined) {
      Path.setIn(form.data, field.valueFormat, field.value);
    }
    const _field = createProxy(field, {
      setValue: (_setValue, target) => {
        return value => {
          const _value = Transfers[target.type](value);
          emitFieldEvent(FieldEvents.valueChange(target.name), {
            name: field.name,
            value: _value,
            link: target.link ? form.data[target.link as keyof T] : undefined
          });
          target.clearValidation();

          return _setValue.call(target, _value);
        };
      },
      resetValue: (_setInitialValue, target) => {
        return () => {
          emitFieldEvent(FieldEvents.valueChange(target.name), {
            name: field.name,
            value: target.initialValue
          });
          target.clearValidation();

          return _setInitialValue.call(target);
        };
      },
      setDisplay: (_setDisplay, target) => {
        return display => {
          Object.keys(display).forEach(key => {
            emitFieldEvent(FieldEvents.optionChange(target.name, key), {
              name: target.name,
              option: {
                [key]: display[key as keyof FieldDisplay]
              }
            });
          });
          emitFieldEvent(FieldEvents.optionChange(target.name, "*"), {
            name: target.name,
            option: display
          });
          return _setDisplay.call(target, display);
        };
      }
    });

    form.addField(_field);
  });

  /**
   * 设置表单状态
   * @param state 表单状态
   */
  const formState = (state: Partial<ChangeableFormState>) => {
    form.state.setChangeableState(state);
  };
  /**
   * 设置表单初始值
   * @param resolve 初始值确认函数，调用后表单接收到数据
   */
  const formInitialize = (
    resolve: (loader: (_data: FormData<T>) => void) => void
  ) => {
    form.initializeData(resolve);
  };
  /**
   * 设置表单数据
   * @param resolve 表单数据确认函数，调用后表单接收到数据
   */
  const formData = (
    resolve: (loader: (_data: FormData<T>) => void) => void
  ) => {
    form.setData(resolve);
  };
  /**
   * 使用默认值初始化表单数据
   */
  const formReset = () => {
    form.resetData();
  };
  /**
   * 清空表单数据，忽略默认值
   */
  const formClear = () => {
    form.clearData();
  };
  /**
   * 设置字段状态
   * @param key 字段匹配符
   * @param state 字段状态
   */
  const fieldState = (key: string, state: Partial<ChangeableFieldState>) => {
    form.getFields(key).forEach(field => field.state.setChangeableState(state));
  };
  /**
   * 设置字段控件选项
   * @param key 字段匹配符
   * @param option 字段控件选项
   */
  const fieldOption = (key: string, option: Partial<FieldDisplay>) => {
    form.getFields(key).forEach(field => field.setDisplay(option));
  };
  /**
   * 设置字段值
   * @param key 字段匹配符
   * @param value 字段值
   */
  const fieldValue = (key: string, value: any) => {
    form.getFields(key).forEach(field => field.setValue(value));
  };

  // config.created?.(_form);

  const actions = {
    formInitialize,
    formData,
    formReset,
    formClear,
    formState,
    fieldState,
    fieldOption,
    fieldValue
  };

  return {
    form,
    created: (handler: (_form: FormCore<T>) => void) => {
      handler(_form);
    },
    actions
  };
};

export {
  createForm,
  emitFormEvent,
  emitFieldEvent,
  onEvent,
  onFormValueChange,
  onFormStateChange,
  onFieldValueChange,
  onFieldStateChange,
  onFieldOptionChange
};
