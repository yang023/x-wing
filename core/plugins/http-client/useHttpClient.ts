/* eslint-disable @typescript-eslint/no-unused-vars */
import { get } from "./baseUrl";
import urlWithPathValues from "./urlWithPathValues";
import AbstractClient from "./AbstractHttpClient";
import FetchClient from "./FetchHttpClient";
import { HttpClientHandler, HttpService } from "./index.d";
import { computed, ComputedRef, reactive } from "vue";
import { UnwrapRef } from "vue";

type ErrorDetails = {
  name: string;
  error: Error;
  time: number;
};

type ClientType<I = any, P = any> = new () => AbstractClient<I, P>;

/**
 * 所使用的 HttpClient 对象的 Class 构造函数
 */
const Contructors: { default: ClientType } = { default: FetchClient };

/**
 * 使用 Contructors.default 构造函数创建 HttpClient 对象
 */
const Factory = {
  create<I, P>(type: ClientType<I, P>) {
    return new type();
  }
};

/**
 * 设置要使用的 HttpClient 实现类
 * @param client HttpClient 的构造函数
 */
const setClient = <I, P>(client: ClientType<I, P>) => {
  Contructors.default = client;
};

/**
 * 发送请求
 *
 * @example
 *  useHttpClient((baseUrl, service) => {
 *    const key = "example"; // required
 *    const version = "v1"; // default is "default"
 *    const url = baseUrl(key, "/example/{test}", version);
 *    const method = "get"; // "get" or "post" or "delete" or "put"
 *    const data = {
 *      test: "a"
 *    };
 *    service(url, method, data); // real url is "example/example/a"
 *  }, {
 *    onSuccess: (res) => {
 *      console.log(res)
 *    }
 *  })
 *
 * @param handler HttpClient 请求参数设置
 * @param callback 回调
 */
const useHttpClient = <I = any, P = any>(
  handler: HttpClientHandler<I, P>
): {
  loading: ComputedRef<boolean>;
  data: ComputedRef<P>;
  error: ComputedRef<ErrorDetails>;
  errors: ComputedRef<ErrorDetails[]>;
} => {
  const state = reactive({
    loading: false,
    data: (undefined as unknown) as P,
    error: (undefined as unknown) as ErrorDetails,
    errors: [] as ErrorDetails[]
  });
  const fetcher: HttpService<I, P> = (
    url,
    method = "get",
    data = {} as I,
    headers = new Headers()
  ) => {
    const _url = urlWithPathValues(url, data);

    state.loading = true;
    const instance = Factory.create<I, P>(Contructors.default);
    return instance
      .send(_url, method, data, headers)
      .then(resp => {
        state.data = resp as UnwrapRef<P>;
        return resp;
      })
      .catch((error: Error) => {
        const details: ErrorDetails = {
          name: error.name,
          error: new Proxy(error, {
            set: () => false
          }),
          time: Date.now()
        };
        state.error = details;
        state.errors.push(details);
        return error as any;
      })
      .finally(() => {
        state.loading = false;
      });
  };

  handler((key, path, version) => {
    const _url = get(key, version);
    return `${_url}/${path}`;
  }, fetcher);

  return {
    data: computed(() => state.data) as ComputedRef<P>,
    loading: computed(() => state.loading),
    error: computed(() => state.error),
    errors: computed(() => state.errors)
  };
};

export { setClient };

export default useHttpClient;
