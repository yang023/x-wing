import { State } from "./state";
import { XMutations } from "@core/app.d";

type IndexMutation = {
  TEST_A: number;
  TEST_B: string;
};

const mutations: XMutations<IndexMutation, State> = {
  TEST_A: (state, payload = 0) => {
    state.a = payload;
  },
  TEST_B: (state, payload = "") => {
    state.b = payload;
  }
};

export default mutations;

export { IndexMutation };
