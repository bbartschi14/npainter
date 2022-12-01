type PainterEvents = "save" | "none";

function subscribe(eventName: PainterEvents, listener) {
  document.addEventListener(eventName, listener);
}

function unsubscribe(eventName: PainterEvents, listener?) {
  document.removeEventListener(eventName, listener);
}

function publish(eventName: PainterEvents, data) {
  const event = new CustomEvent(eventName, { detail: data });
  document.dispatchEvent(event);
}

export { publish, subscribe, unsubscribe };
