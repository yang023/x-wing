import AntButton from "ant-design-vue/lib/button";
import "ant-design-vue/lib/button/style";
import { defineComponent } from "vue";

AntButton.name = "XButton";
import props from "./props";

const Button = defineComponent({
  props: {
    ...props,
    loading: {
      type: Boolean,
      default: false
    },
    onClick: {
      type: Function,
      required: false
    }
  },
  setup(props, { slots }) {
    return () => <AntButton {...props}>{slots.default?.()}</AntButton>;
  }
});

export { Button as XButton };
