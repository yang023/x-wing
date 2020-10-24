import * as Storage from "./helper";
import { Subject } from "rxjs";

class XStorage implements StorageCore {
  type: StorageType;

  readonly $events = new Subject<{
    type: StorageOperator;
    payload: { name: string; value: any | undefined };
  }>();

  constructor(type: StorageType) {
    this.type = type;
  }

  setItem<T>(key: string, value: T, timeout?: number): void {
    Storage.setItem<T>(this.type, key, value, timeout);
    this.$events.next({
      type: "set",
      payload: {
        name: key,
        value: value
      }
    });
  }
  getItem<T>(
    key: string,
    callback?: (value: T | undefined) => void
  ): T | undefined {
    const value = Storage.getItem<T>(this.type, key);
    this.$events.next({
      type: "set",
      payload: {
        name: key,
        value: value
      }
    });
    callback?.(value);
    return value;
  }

  subscribe(
    callback: <T>(
      type: StorageOperator,
      payload: { name: string; value: T | undefined }
    ) => void
  ): void {
    this.$events.subscribe(({ type, payload }) => {
      callback(type, payload);
    });
  }
}

export default XStorage;
