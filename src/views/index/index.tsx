import { defineComponent } from "vue";

import { createForm, onFieldValueChange, XForm } from "@core/app";

type Data = {
  a: string | Date;
  b1: string;
  b2: string;
};

export default defineComponent(() => {
  const { form, actions } = createForm<Data>({
    id: "1",
    fields: [
      {
        name: "startDate",
        label: "Start Date",
        type: "date",
        link: "startDate"
      },
      {
        name: "endDate",
        label: "End Date",
        type: "date",
        link: "startDate"
      }
    ]
  });

  form.create();

  // 通过两个 date field 的相互联动 实现范围选择
  onFieldValueChange<moment.Moment>("startDate", ({ value }) => {
    actions.fieldOption("endDate", {
      disabledDate: now => {
        return now.unix() < value.unix();
      }
    });
  });
  onFieldValueChange<moment.Moment, moment.Moment>(
    "endDate",
    ({ value, link }) => {
      if (link && link.unix() > value.unix()) {
        actions.fieldValue("startDate", null);
      }
      actions.fieldOption("startDate", {
        disabledDate: now => {
          return now.unix() > value.unix();
        }
      });
    }
  );

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
