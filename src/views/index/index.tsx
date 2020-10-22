import { defineComponent } from "vue";
import { useState, useMutations } from "@core/plugins/store/storeContext";

export default defineComponent(() => {
  const state = useState("index");

  const mutations = useMutations("index");
  setTimeout(() => {
    mutations("TEST", Math.random());
  }, 1000);
  return () => <div>{JSON.stringify(state)}</div>;
});
