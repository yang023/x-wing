import AntCheckbox from "ant-design-vue/lib/checkbox";
import "ant-design-vue/lib/checkbox/style";

const AntCheckboxGroup = AntCheckbox.Group;

AntCheckbox.name = "Checkbox";
AntCheckboxGroup.name = "CheckboxGroup";

export { AntCheckbox as XCheckbox, AntCheckboxGroup as XCheckboxGroup };
