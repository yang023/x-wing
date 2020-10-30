import starter from "@core/app";

import "./normalize.css";
import "./app.less";

import "@antd-ui";

starter().then(start => {
  start("#app");
});
