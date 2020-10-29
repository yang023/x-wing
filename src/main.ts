import starter from "@core/app";

import "./normalize.css";
import "./app.less";

import "@antd-ui";

starter({
  defaultLayout: true
}).then(start => {
  start("#app");
});
