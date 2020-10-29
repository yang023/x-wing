import { FieldCore, FieldDisplay, FieldState, FormState } from "./types";
/**
 * 事件名称规则：
 * 表单事件：form.[EVENTS]
 * 字段事件：field.[FIELD_PATH].[EVENTS]
 *
 * EVENTS：状态变化：state.[STATE_TYPE].change
 *         值变化：value.change
 *         配置变化：option.[OPTION_TYPE].change
 *         控件事件：item.[EVENT_TYPE]
 *         表单：提交：submit
 *              校验成功：valid
 *              校验失败：invalid
 * EVENT_TYPE：控件相关的事件类型，如 input 的 onInput, onBlur, onFocus 等, 去掉 on 后的小写名称：input, blue, focus 等
 */
const FormEvents = {
  submit: () => "form.submit",
  valueChange: () => "form.value.change",
  stateChange: <T = FormState>(key: keyof T | "*") => `form.state.${key}.change`
};

const FieldEvents = {
  registered: (field: FieldCore) => `field.${field.name}.registered`,
  valueChange: (fieldName: string) => `field.${fieldName}.value.change`,
  stateChange: <T = FieldState>(fieldName: string, key: keyof T | "*") =>
    `field.${fieldName}.state.${key}.change`,
  optionChange: <T = FieldDisplay>(fieldName: string, key: keyof T | "*") =>
    key === "*"
      ? `field.${fieldName}.option.change`
      : `field.${fieldName}.option.${key}.change`
};

export { FormEvents, FieldEvents };
