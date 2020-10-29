import AntRadio from "ant-design-vue/lib/radio";
import "ant-design-vue/lib/radio/style";

const AntRadioGroup = AntRadio.Group;

AntRadio.name = "Radio";
AntRadioGroup.name = "RadioGroup";

export { AntRadio as XRadio, AntRadioGroup as XRadioGroup };
