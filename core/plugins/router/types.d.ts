export type DateSource<T, R> = (arg: T) => R;
import { RouteRecordRaw } from "vue-router";

export type PageConfig<T extends object> = {
  title?: string;
  state?: T;
};

export type PageState<T> = {
  title: string;
  state: T;
};

export type PageMetaConfig = {
  name: string;
  index?: boolean;
  config?: PageConfig<any>;
  file?: string;
  layout?: string;
  state?: {
    [name: string]: any;
  };
};

export type PageRoutesConfig = {
  [name: string]: PageMetaConfig;
};

export type ExtRoute<T> = {
  meta: PageState<T>;
} & RouteRecordRaw;
