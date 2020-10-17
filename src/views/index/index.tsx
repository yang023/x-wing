import { defineComponent } from "vue";

import { createForm, XForm } from "@core/plugins/form";

type Data = {
  a: string;
  b: string;
};

export default defineComponent(() => {
  const { form } = createForm<Data>({
    id: "1",
    fields: [
      {
        name: "a",
        label: "A",
        type: "datetime",
        tips: "123",
        defaultValue: new Date(),
        rules: { required: true, message: "错误" }
      },
      {
        name: "b",
        type: "checkbox",
        eumns: [
          { title: "A", value: "a" },
          { title: "B", value: "b" }
        ],
        label: "B",
        defaultValue: [],
        rules: { required: true, message: "错误" }
      }
    ]
  });

  form.create();

  return () => (
    <div style="width: 500px;margin:10px auto">
      <XForm form={form}></XForm>
      <button
        onClick={() => {
          form.validate(errors => {
            console.log(errors);
          });
        }}
      >
        Validate
      </button>
      <button
        onClick={() => {
          form.clearData();
        }}
      >
        ClearData
      </button>
      <button
        onClick={() => {
          form.resetData();
        }}
      >
        ResetData
      </button>
    </div>
  );
});
