import { setComponent, FormConfig } from "@core/app";

import Input from "./Input";
import Select from "./Select";
import Checkbox from "./Checkbox";
import Radio from "./Radio";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";

import DefaultFieldLayout from "./DefaultFieldLayout";
import DefaultFormLayout from "./DefaultFormLayout";
import DefaultOptionsLayout from "./DefaultOptionsLayout";
import DefaultGroupLayout from "./DefaultGroupLayout";
import DefaultGroupItemLayout from "./DefaultGroupItemLayout";

setComponent("Input", Input);
setComponent("Password", Input);
setComponent("Select", Select);
setComponent("Checkbox", Checkbox);
setComponent("Radio", Radio);
setComponent("Date", DatePicker);
setComponent("Time", TimePicker);

FormConfig.setFieldLayout(DefaultFieldLayout);
FormConfig.setFormLayout(DefaultFormLayout);
FormConfig.setOptionsLayout(DefaultOptionsLayout);
FormConfig.setFieldGroupLayout(DefaultGroupLayout, DefaultGroupItemLayout);
