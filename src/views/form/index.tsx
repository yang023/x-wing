import { defineComponent } from "vue";

import { createForm, onFieldValueChange, toMoment, XForm } from "@core/app";
import { XAsnycButton, XButton } from "@antd-ui/index";

type Data = {
  startDate: string | Date | moment.Moment;
  endDate: string | Date | moment.Moment;
};

export default defineComponent(() => {
  const { form, created, actions } = createForm<Data>({
    id: "1",
    groups: [
      { name: "t1", title: "T1" },
      { name: "t2", title: "T2" }
    ],
    ui: {
      itemGrid: {
        span: 12
      }
    },
    fields: [
      {
        name: "startDate",
        label: "Start Date",
        type: "date",
        defaultValue: new Date(),
        link: "startDate",
        group: "t1"
      },
      {
        name: "endDate",
        label: "End Date",
        type: "date",
        link: "startDate",
        rules: { required: true },
        group: "t1"
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
    <>
      <XForm
        form={form}
        v-slots={{
          submit: () => {
            return (
              <XAsnycButton
                type="primary"
                click={done => {
                  // 异步按钮，调用 done 取消 loading 状态
                  setTimeout(() => {
                    form.validate(errors => {
                      console.log(errors);
                      done();
                    });
                  }, 1000);
                }}
              >
                Validate
              </XAsnycButton>
            );
          },
          clear: () => {
            return (
              <XButton
                type="danger"
                onClick={() => {
                  form.clearData();
                }}
              >
                ClearData
              </XButton>
            );
          },
          reset: () => {
            return (
              <XButton
                onClick={() => {
                  form.resetData();
                }}
              >
                ResetData
              </XButton>
            );
          }
        }}
      ></XForm>
    </>
  );
});
