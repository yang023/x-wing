export type HttpService<I, P> = (
  url: string,
  method: "get" | "post" | "delete" | "put",
  data?: I,
  headers?: Headers
) => Promise<P>;
export type BaseUrlGetter = (
  key: string,
  path: string,
  version?: string
) => string;

export type HttpClientHandler<I = any, P = any> = (
  baseUrl: BaseUrlGetter,
  fetcher: HttpService<I, P>
) => void;

export type BaseUrlContext = {
  default: string;
  [version: string]: string;
};

export type BaseURL = string | BaseUrlContext;
