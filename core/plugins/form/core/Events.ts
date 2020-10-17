import { Subject } from "rxjs";
import { EventsCore, EventType } from "../types";
import { Path } from "cool-path";

class Events implements EventsCore {
  readonly events: Subject<EventType>;

  constructor() {
    this.events = new Subject<EventType>();
  }
  bind<E>(key: string, handler: (e: E) => void) {
    const subscription = this.events.subscribe(
      ({ event, payload }: EventType) => {
        if (new Path(event).match(key)) {
          handler(payload);
        }
      }
    );
    return () => subscription.unsubscribe();
  }
  emit<E>(key: string, e: E): void {
    this.events.next({
      event: key,
      payload: e
    });
  }
}

export default Events;
