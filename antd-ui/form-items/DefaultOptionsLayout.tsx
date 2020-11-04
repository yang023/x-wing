import { defineComponent, ref } from "vue";

import { XFormItem } from "../extends";

const DefaultFieldLayout = defineComponent({
  setup(_props, { slots }) {
    const content = ref(() => null as unknown);
    if (slots.default) {
      content.value = slots.default;
    } else {
      content.value = () => (
        <>
          {slots.submit?.()}
          {slots.reset?.()}
          {slots.clear?.()}
        </>
      );
    }
    return () => (
      // label 设置为空格，否则 label 的 col 不生效
      <XFormItem label=" " colon={false}>
        {content.value()}
      </XFormItem>
    );
  }
});
export default DefaultFieldLayout;
