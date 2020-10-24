import { defineComponent } from "vue";

import {
  createForm,
  onFormValueChange,
  XForm,
  useState,
  useActions
} from "@core/app";

import { State } from "./store/state";
import { IndexActions } from "./store/actions";

type Data = {
  a: string | Date;
  b1: string;
  b2: string;
};

export default defineComponent(() => {
  const state = useState<State>("index");

  const actions = useActions<IndexActions>("index");
  setTimeout(() => {
    actions.dispatch("ACTION_A", 1);
  }, 1000);

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
          { title: "B", value: "b" },
          { title: "C", value: "c" }
        ],
        label: "B",
        defaultValue: [],
        sourceFormat: "[b1,b2]",
        valueFormat: "{0:b1,1:b2}",
        rules: { required: true, message: "错误" }
      }
    ]
  });

  form.create();

  form.setData(resolve => {
    setTimeout(() => {
      resolve({
        a: new Date("2020-10-01 01:01"),
        b1: "a",
        b2: "b"
      });
    }, 1000);
  });

  onFormValueChange<Data>(val => {
    console.log(val);
  });

  return () => (
    <div style="width: 500px;margin:10px auto">
      <div>{JSON.stringify(state)}</div>
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
