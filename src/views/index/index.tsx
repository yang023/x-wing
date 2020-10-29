import { defineComponent } from "vue";
import { RouterLink } from "vue-router";

export default defineComponent(() => {
  return () => (
    <div style="width: 500px;margin:10px auto">
      <RouterLink to={{ name: "form" }}>Form</RouterLink>
    </div>
  );
});
