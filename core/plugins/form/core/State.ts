import { Connect, StateCore, StateType } from "../types";

class State<R extends StateType, C extends StateType>
  implements StateCore<R, C> {
  readonly state: Connect<R, C> = {} as Connect<R, C>;

  constructor(readonlyState: R, changeableState: C) {
    Object.assign(this.state, {
      ...readonlyState,
      ...changeableState
    });
  }

  setReadonlyState(_state: Partial<R>) {
    Object.assign(this.state, _state);
  }
  setChangeableState(_state: Partial<C>) {
    Object.assign(this.state, _state);
  }
  getState() {
    return Object.assign({}, this.state) as R & C;
  }

  specify(key: keyof R | keyof C) {
    const state = this.getState();
    return state[key];
  }
}

export default State;
