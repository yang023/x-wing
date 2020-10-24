import { StoreOptions } from "vuex";

type RootState = {
  a: number;
};

const createOption = <S = any>(option: StoreOptions<S>) => option;

const option = createOption({
  state: { a: 1 }
});

export { RootState };

export default option;
