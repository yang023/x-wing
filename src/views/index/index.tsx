import { defineComponent } from "vue";

import { createForm, onFieldValueChange, XForm, toMoment } from "@core/app";

type Data = {
  startDate: string | Date | moment.Moment;
  endDate: string | Date | moment.Moment;
};

export default defineComponent(() => {
  const { form, created, actions } = createForm<Data>({
    id: "1",
    fields: [
      {
        name: "startDate",
        label: "Start Date",
        type: "date",
        defaultValue: new Date(),
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

  // 若联动的字段有默认值，则调用 form.created 函数进行设置
  created(_form => {
    actions.fieldOption("endDate", {
      disabledDate: now => {
        const startDate = _form.data.startDate;
        if (startDate === null || startDate === undefined) {
          return false;
        }
        return now.unix() < toMoment(startDate).unix();
      }
    });
  });

  // 通过两个 date field 的相互联动 实现范围选择
  onFieldValueChange<moment.Moment>("startDate", ({ value }) => {
    actions.fieldOption("endDate", {
      disabledDate: now => {
        if (value === null || value === undefined) {
          return false;
        }
        return now.unix() < value.unix();
      }
    });
  });
  onFieldValueChange<moment.Moment, moment.Moment>(
    "endDate",
    ({ value, link }) => {
      if (value === null || value === undefined) {
        return false;
      }
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
