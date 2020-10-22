/* eslint-disable @typescript-eslint/no-unused-vars */
type CompletedHandler<P> = ((res: P) => void) | undefined;

/**
 * HttpClient 的抽象实现，整合 ajax 异步请求库
 */
abstract class AbstractClient<I, P> {
  private onSuccessHandler: CompletedHandler<P>;
  private onErrorHandler: CompletedHandler<P>;

  /**
   * 发送异步请求（ajax/fetch）获取数据
   * @param url 请求地址
   * @param method 请求方法
   * @param data 请求数据，根据 method 自动设置 queryString 或 body
   * @param headers 自定义 header
   */
  async send(
    url: string,
    method: "get" | "post" | "delete" | "put",
    data?: I,
    headers?: Headers
  ): Promise<P> {
    try {
      const res: P = await this.doSending(url, method, data, headers);
      this.onSuccessHandler?.(res);
      return res;
    } catch (e) {
      this.onErrorHandler?.(e);
      throw e;
    }
  }

  /**
   * 发送异步请求（ajax/fetch）获取数据，由子类实现，执行实际的请求发送逻辑，默认实现： FetchClient
   *
   * @param _url 请求地址
   * @param _method 请求方法
   * @param _data 请求数据，根据 method 自动设置 queryString 或 body
   * @param _headers 自定义 header
   */
  protected doSending(
    _url: string,
    _method: "get" | "post" | "delete" | "put",
    _data?: I,
    _headers?: Headers
  ): Promise<P> {
    throw new Error("Method must be implemented");
  }

  /**
   * 设置请求成功回调
   * @param handler 请求成功回调
   */
  setSuccessHandler(handler: CompletedHandler<P>) {
    this.onSuccessHandler = handler;
  }
  /**
   * 设置失败回调
   * @param handler 失败回调
   */
  setErrorHandler(handler: CompletedHandler<P>) {
    this.onErrorHandler = handler;
  }
}

export default AbstractClient;
