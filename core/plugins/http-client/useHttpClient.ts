/* eslint-disable @typescript-eslint/no-unused-vars */
import { get } from "./baseUrl";
import urlWithPathValues from "./urlWithPathValues";
import AbstractClient from "./AbstractHttpClient";
import FetchClient from "./FetchHttpClient";
import { HttpClientHandler, HttpService } from "./index.d";

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
 * 默认回调
 */
const Callbacks: {
  onSuccess: <T = any>(res: T) => void;
  onError: <T = any>(res: T) => void;
} = {
  onSuccess: _res => void 0,
  onError: _error => void 0
};

const setSuccessHandler = (handler: <T = any>(res: T) => void) => {
  Callbacks.onSuccess = handler;
};

const setErrorHandler = (handler: <T = any>(error: T) => void) => {
  Callbacks.onError = handler;
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
  handler: HttpClientHandler<I, P>,
  callback: {
    onSuccess?: (res: P) => void;
    onError?: (res: P) => void;
  }
): void => {
  const fetcher: HttpService<I, P> = (
    url,
    method = "get",
    data = {} as I,
    headers = new Headers()
  ) => {
    const _url = urlWithPathValues(url, data);

    const instance = Factory.create<I, P>(Contructors.default);
    instance.setSuccessHandler(callback.onSuccess || Callbacks.onSuccess);
    instance.setErrorHandler(callback.onError || Callbacks.onError);
    return instance.send(_url, method, data, headers);
  };

  handler((key, path, version) => {
    const _url = get(key, version);
    return `${_url}/${path}`;
  }, fetcher);
};

export { setClient, setSuccessHandler, setErrorHandler };

export default useHttpClient;
