import { defineComponent, PropType, ref } from "vue";
import { XButton } from "./Button";

import props from "./props";

type AsnycButtonClickHandler = (done: () => void) => void;

const AsnycButton = defineComponent({
  inheritAttrs: false,
  props: {
    ...props,
    click: {
      type: Function as PropType<AsnycButtonClickHandler>,
      required: true
    }
  },
  setup(props, { slots }) {
    const loading = ref(false);
    const setLoading = (_loading: boolean) => {
      loading.value = _loading;
    };

    const done = () => {
      setLoading(false);
    };

    return () => (
      <XButton
        {...props}
        loading={loading.value}
        onClick={() => {
          setLoading(true);
          props.click(done);
        }}
      >
        {slots.default?.()}
      </XButton>
    );
  }
});

export { AsnycButton as XAsnycButton };
