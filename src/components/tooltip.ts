import tippy, { Instance, Props } from "tippy.js";
import "tippy.js/dist/tippy.css";

/** tippy options */
const options: Partial<Props> = {
  delay: [50, 0],
  duration: [100, 100],
  allowHTML: true,
  appendTo: document.body,
  aria: { content: "auto" },
  // onHide: () => false,
};

/** listen for changes to document */
new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    const element = mutation.target as HTMLElement;

    /** when nodes added/removed */
    if (mutation.type === "childList")
      element
        .querySelectorAll<HTMLElement>("[data-tooltip]")
        .forEach(makeTippy);

    /** when data-tooltip updates */
    if (mutation.type === "attributes") makeTippy(element);
  }
}).observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ["data-tooltip"],
});

/** extend normal element type with javascript-attached tippy instance */
type _Element = HTMLElement & { _tippy: Instance };

/** create or update tippy instance */
const makeTippy = (element: HTMLElement) => {
  /** get tooltip content from attribute */
  const content = element.getAttribute("data-tooltip")?.trim() || "";

  /** don't show if content blank */
  if (!content) return;

  /** get existing tippy instance or create new */
  const instance: Instance =
    (element as _Element)._tippy || tippy(element, options);

  /** only make interactive if content includes link to click on */
  instance.setProps({ interactive: content.includes("<a") });

  /** set aria label to content */
  instance.reference.setAttribute("aria-label", content);

  /** update tippy content */
  instance.setContent(content);

  /** force re-position after rendering updates */
  if (instance.popperInstance)
    window.setTimeout(instance.popperInstance.update, 100);
};
