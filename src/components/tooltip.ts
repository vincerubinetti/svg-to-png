import tippy, { Instance, Props } from "tippy.js";
import "tippy.js/dist/tippy.css";

/** tippy options */
const options: Partial<Props> = {
  delay: [50, 0],
  duration: [100, 100],
  allowHTML: true,
  interactive: true,
  appendTo: document.body,
  aria: { content: "auto" },
  onCreate: (instance: Instance) => {
    instance?.reference.setAttribute(
      "aria-label",
      instance?.reference.getAttribute("data-tooltip") || ""
    );
  },
  onShow: (instance: Instance) => {
    /** don't show if no content */
    if (!instance?.reference?.getAttribute("data-tooltip")?.trim())
      return false;
  },
  // onHide: () => false
};

/** extend normal element type with javascript-attached tippy instance */
type _Element = Element & { _tippy: Instance };

/** listen for changes to document */
new MutationObserver(() => {
  /** elements with tooltip attribute */
  const elements: NodeListOf<_Element> =
    document.querySelectorAll("[data-tooltip]");

  for (const element of elements) {
    /** get tooltip content from attribute */
    const content = element.getAttribute("data-tooltip")?.trim() || "";

    /** if tippy instance doesn't exist for element yet, create one */
    if (!element._tippy) tippy(element, options);

    /** update tippy content */
    element._tippy.setContent(content);

    /** force re-position after rendering updates */
    if (element._tippy.popperInstance)
      window.setTimeout(element._tippy.popperInstance.update, 10);
  }
}).observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ["data-tooltip"],
});
