import { defineComponent } from "vue";

import { XFormItem } from "../extends";

const DefaultFieldLayout = defineComponent({
  setup(_props, { slots }) {
    return () => (
      // label 设置为空格，否则 label 的 col 不生效
      <XFormItem label=" " colon={false}>
        {slots.default?.()}
      </XFormItem>
    );
  }
});
export default DefaultFieldLayout;
