import AntForm from "ant-design-vue/lib/form";
import "ant-design-vue/lib/form/style";

const AntFormItem = AntForm.Item;

AntForm.name = "Form";
AntFormItem.name = "FormItem";

export { AntForm as XFormWrapper, AntFormItem as XFormItem };
