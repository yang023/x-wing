import starter from "@core/app";

import "./normalize.css";
import "./app.less";

starter({
  defaultLayout: true
}).then(start => {
  start("#app");
});
