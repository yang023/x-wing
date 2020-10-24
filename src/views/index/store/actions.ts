import { State } from "./state";
import { IndexMutation } from "./mutations";
import { XActions } from "@core/app.d";

type IndexActions = {
  ACTION_A: number;
  ACTION_B: string;
};

const actions: XActions<IndexActions, IndexMutation, State> = {
  ACTION_A: ({ commit }, payload = 0) => {
    commit("TEST_A", payload);
  },
  ACTION_B: ({ commit }, payload = "") => {
    commit("TEST_B", payload);
  }
};

export default actions;

export { IndexActions };
