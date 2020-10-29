import { PropType } from "vue";

const props = {
  disabled: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  },
  htmlType: {
    type: String as PropType<"button" | "submit" | "reset">,
    default: "button"
  },
  ghost: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    required: false
  },
  type: {
    type: String as PropType<"primary" | "dashed" | "danger" | "link">,
    default: "default"
  },
  size: {
    type: String as PropType<"large" | "small">,
    default: "default"
  },
  shape: {
    type: String as PropType<"circle" | "round">,
    required: false
  }
};

export default props;
