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

export type HttpClientHandler<I, P> = (
  baseUrl: BaseUrlGetter,
  fetcher: HttpService<I, P>
) => void;
