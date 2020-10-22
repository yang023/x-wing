const a = {
  TEST: (state: { a: any }, payload = 0) => {
    state.a = payload;
  }
};

export default a;
