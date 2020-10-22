import AbstractClient from "./AbstractHttpClient";

/**
 * http/ajax 异步请求库 fetch-api 实现
 */
class FetchClient<I, P> extends AbstractClient<I, P> {
  async doSending(
    url: string,
    method: "get" | "post" | "put" | "delete",
    data = {},
    headers = new Headers()
  ): Promise<P> {
    const config: RequestInit = {
      method,
      headers
    };
    if (method !== "get" && Object.keys(data)) {
      config.body = JSON.stringify(Object.assign({}, data));
    }

    const res = await fetch(url, config);
    return res.json();
  }
}

export default FetchClient;
