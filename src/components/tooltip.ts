import tippy, { Instance, Props } from "tippy.js";
import "tippy.js/dist/tippy.css";

/** tippy options */
const options: Partial<Props> = {
  delay: [50, 0],
  duration: [100, 100],
  allowHTML: true,
  appendTo: document.body,
  // onHide: () => false,
};

/** listen for changes to document */
new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    /** when nodes added/removed */
    if (mutation.type === "childList") {
      for (const node of mutation.addedNodes)
        if (node instanceof Element)
          selectAll(node, "[data-tooltip]").forEach(update);

      for (const node of mutation.removedNodes)
        if (node instanceof Element)
          selectAll(node, "[data-tooltip]").forEach(remove);
    }

    /** when data-tooltip attrs updated */
    if (mutation.type === "attributes" && mutation.target instanceof Element)
      update(mutation.target);
  }
}).observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ["data-tooltip"],
});

/** extend normal element with attached tippy instance */
type _Element = Element & { _tippy?: Instance };

/** create or update tippy instance */
const update = (element: Element) => {
  /** get tooltip content from attribute */
  const content = element.getAttribute("data-tooltip")?.trim() || "";

  /** don't show if content blank */
  if (!content) {
    remove(element);
    return;
  }

  /** get existing tippy instance or create new */
  const instance: Instance =
    (element as _Element)._tippy || tippy(element, options);

  /** only make interactive if content includes link to click on */
  instance.setProps({ interactive: content.includes("<a") });

  /** set aria label to content */
  instance.reference.setAttribute("aria-label", makeLabel(content));

  /** update tippy content */
  instance.setContent(content);

  /** force re-position after rendering updates */
  if (instance.popperInstance)
    window.setTimeout(instance.popperInstance.update, 20);
};

/** remove tippy instance */
const remove = (element: Element) => (element as _Element)._tippy?.destroy();

/** make aria label from html string */
export const makeLabel = (string: string) =>
  (
    new DOMParser().parseFromString(string, "text/html").body.textContent || ""
  ).replaceAll(/\s+/g, " ");

/** query select all, including self */
const selectAll = <T extends Element>(element: Element, selector: string) => [
  ...(element.matches(selector) ? [element] : []),
  ...element.querySelectorAll<T>(selector),
];
