import { GetterTree } from "vuex";
import { State } from "./state";

const getters: GetterTree<State, any> = {
  a2: state => state.a * 2
};

export default getters;
