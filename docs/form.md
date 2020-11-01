## 表单驱动器

统一管理收集用户输入，并校验输入结果的组件集合

> 借鉴 [formily](https://formilyjs.org/)，实现非嵌套结构的表单统一化组件，简化表单的数据收集、UI布局等繁琐操作，实现表单页面的快速开发

为支持接入不同的 UI 框架，表单驱动器仅包含对表单数据、表单字段的管理，以及维护的输入组件
目前支持的输入组件：
* Input
* Select
* Checkbox
* Radio
* Date
* Time
* Datetime

默认的组件UI：[ant-design-vue](https://2x.antdv.com/docs/vue/introduce-cn/)

### 创建表单
```
import { defineComponent } from "vue";

import { createForm, XForm } from "@core/app";

type Data = {
  a: string;
  b: string;
};

export default defineComponent(() => {

  // 创建表单驱动器，指定泛型后，编译器会对 form.setData, form.setInitialData 方法提供类型支持
  const { form } = createForm<Data>({
    // 定义表单的 ID
    id: "1", 
    // 定义表单字段
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

  // 调用此方法后表单组件正式启动
  form.create();

  return () => (
    <div style="width: 500px;margin:10px auto">
      <XForm form={form}></XForm>
      <button
        onClick={() => {
          // 校验表单输入
          form.validate(errors => {
            console.log(errors, form.data);
          });
        }}
      >
        Validate
      </button>
      <button
        onClick={() => {
          // 清空表单数据
          form.clearData();
        }}
      >
        ClearData
      </button>
      <button
        onClick={() => {
          // 重置表单数据
          form.resetData();
        }}
      >
        ResetData
      </button>
    </div>
  );
});

```

#### 字段定义：
  * name: 必填，指定字段名
  * label: 可选，
  * tips: 可选，字段描述提示
  * type: 可选，受支持的输入组件
  * eumns: 可选，下拉框、单选、多选等所需，作为数据源提供选择
    * title: 选项标题/描述
    * value: 选项值
    * disable: 禁用选项
  * defaultValue: 可选，字段的默认值，resetValue() 方法会使用其设置字段的值
  * rules: 可选，async-validator 的配置
  * valueFormat: 可选，字段解构用，默认为 name 值

#### 字段转换与解构
第三方组件中，DatePicker 的范围选择器的 value 一般为数组，但待提交的表单数据通常为一维字段对象，使用 valueFormat 对数据进行解构设置，使用 sourceFormat 对输入数据进行转换：
```
解构规则
valueFormat: "{0:startTime,1endTime}"

字段数据
value: [Date(2020-10-01), Date(2020-10-08)];

解构结果
{
  // ...
  startTime: Date(2020-10-01),
  endTime: Date(2020-10-08)
}

转换规则：
sourceFormat: "{0:b1,1:b2}"

输入实体：
{
  // ...
  startTime: Date(2020-10-01),
  endTime: Date(2020-10-08)
}

转换结果：
value: [Date(2020-10-01), Date(2020-10-08)];


```

#### 事件驱动
  * 表单事件：form.[EVENTS]
  * 字段事件：field.[FIELD_PATH].[EVENTS]
  * EVENTS：状态变化：state.[STATE_TYPE].change
    * 值变化：value.change
    * 配置变化：option.[OPTION_TYPE].change
    * 控件事件：item.[EVENT_TYPE]
    * 表单：提交：submit
    * 校验成功：valid
    * 校验失败：invalid
  * EVENT_TYPE：控件相关的事件类型，如 input 的 onInput, onBlur, onFocus 等, 去掉 on 后的小写名称：input, blue, focus 等
#### 路径系统
  * 参考 [formily](https://formilyjs.org/)， 基于 [cool-path](https://github.com/janrywang/cool-path) 实现路径匹配机制
  * 如监听字段值的变化
```
import { onFieldValueChange } from "@core/plugins/form";

// 监听字段 a 值变化
onFieldValueChange("field.a.value.change", ({name, value}) => {
  // do something
});

// 动态表单（目前尚未支持）： 
// 监听字段 第一组字段a 值变化
onFieldValueChange("field.0.a1.value.change", ({name, value}) => {
  // do something
});

```
具体匹配规则参考 [cool-path](https://github.com/janrywang/cool-path) 文档

#### 接入第三方组件（如 ant-design-vue）：
```
import { defineComponent, PropType } from "vue";
import { emitFieldEvent, setComponent, useValue } from "@core/plugins/form";
import { FieldCore } from "@core/plugins/form/types";

// 若为按需引入
import Input from "ant-design-vue/lib/input";
import "ant-design-vue/lib/input/style";

const AntInput = defineComponent({

  // props 默认定义，不支持其他参数
  props: {
    field: {
      type: Object as PropType<FieldCore>,
      required: true
    }
  },
  setup(props) {
    // useValue 为包装 value 值、监听表单值变化，直接使用即可
    const [value, setValue] = useValue(props.field, "");

    // 具体组件使用规则参考第三方 UI 框架文档
    return () => (
      <Input
        value={value.value}
        onBlur={(e: Event) => {
          // 使用 emitFieldEvent 函数触发相关事件
          emitFieldEvent(`${props.field.name}.blur`, e);
        }}
        onChange={(value: string) => {
          setValue(value);
        }}
      ></Input>
    );
  }
});

setComponent(Input, AntInput);

```

注：若未提供具体 UI 的组件实现，表单将不会被渲染

#### 待实现：
* 动态表单：动态增、删列表表单
* 动态结构：通过 ajax 从服务端获取表单 schema 结构生成表单

[返回](../README.md)
