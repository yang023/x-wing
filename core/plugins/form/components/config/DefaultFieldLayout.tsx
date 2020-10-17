import { computed, defineComponent, PropType } from "vue";
import { FieldCore } from "../../types";
import { useField } from "../XField";

import style from "./items/styles.module.less";

const DefaultFieldLayout = defineComponent({
  props: {
    field: {
      type: Object as PropType<FieldCore>,
      required: true
    }
  },
  setup(props, { slots }) {
    const field = useField(props.field);
    const wrapperClass = computed(() => {
      const classes: string[] = [style.defaultFormItem];
      if (field.state.value.error) {
        classes.push(style.defaultFormItemWithError);
      }
      return classes;
    });

    return () => (
      <div class={wrapperClass.value}>
        <div class={style.defaultFormItemInner}>
          <div class={style.defaultFormItemLabel}>
            {field.option.value.label}
          </div>
          <div class={style.defaultFormItemContent}>{slots.default?.()}</div>
          <div class={style.defaultFormItemTips}>{field.option.value.tips}</div>
        </div>
        <div class={style.defaultFormItemError}>
          {field.option.value.errors}
        </div>
      </div>
    );
  }
});
export default DefaultFieldLayout;
