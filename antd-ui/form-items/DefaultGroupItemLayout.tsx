import { GridUiType } from "@core/app.d";
import { DefineComponent, defineComponent, PropType } from "vue";

import { XCol } from "../extends";

const DefaultFieldLayout = defineComponent({
  props: {
    span: {
      type: Object as PropType<GridUiType>,
      default: () => ({
        xs: 24,
        sm: 12,
        md: 12,
        lg: 8,
        xl: 6,
        xxl: 4
      })
    }
  },
  setup(props, { slots }) {
    console.log(props);

    return () => <XCol {...props.span}>{slots.default?.()}</XCol>;
  }
}) as DefineComponent;
export default DefaultFieldLayout;
