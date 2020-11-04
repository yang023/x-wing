import { defineComponent, shallowRef } from "vue";

import { FormConfig } from "./config";
import { useForm } from "./Provider";
import XField from "./XField";

const Content = defineComponent((_props, { slots }) => {
  const layouts = shallowRef(FormConfig.layouts);
  const { fields, groups, itemGrid } = useForm();

  const optionsContent = slots.options ? (
    <layouts.value.options>{slots.options()}</layouts.value.options>
  ) : (
    <layouts.value.options
      v-slots={{
        default: slots.default,
        submit: slots.submit,
        reset: slots.reset,
        clear: slots.clear
      }}
    ></layouts.value.options>
  );

  return () => (
    <layouts.value.form>
      {slots.default
        ? slots.default()
        : groups.value
            .filter(group => {
              return (
                fields.value.filter(field => field.group === group.name)
                  .length > 0
              );
            })
            .map(({ title, name }) => {
              return (
                <layouts.value.group.wrapper
                  title={title}
                  v-slots={{
                    default: () =>
                      fields.value
                        .filter(field => field.group === name)
                        .map(field => {
                          return (
                            <layouts.value.group.item span={itemGrid.value}>
                              <XField field={field}></XField>
                            </layouts.value.group.item>
                          );
                        })
                  }}
                ></layouts.value.group.wrapper>
              );
            })}
      <layouts.value.group.wrapper title={""}>
        {optionsContent}
      </layouts.value.group.wrapper>
    </layouts.value.form>
  );
});

export default Content;
