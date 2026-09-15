import type { ReactElement, ReactNode } from "react";
import { Popover } from "@base-ui/react";
import clsx from "clsx";

type Props = {
  /** tooltip content */
  content?: ReactNode;
  /** class on popup box */
  className?: string;
  /** tooltip trigger */
  children: ReactElement;
};

/** popup of content on hover or click */
export default function Tooltip({ content, children, className }: Props) {
  if (!content) return children;

  return (
    <Popover.Root>
      <Popover.Trigger openOnHover delay={100}>
        {children}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner
          side="top"
          sideOffset={10}
          collisionPadding={10}
          className="z-30"
          collisionAvoidance={{
            side: "flip",
            align: "shift",
            fallbackAxisSide: "none",
          }}
        >
          <Popover.Popup
            className={clsx(
              "max-h-(--available-height) w-max max-w-[min(var(--available-width),--spacing(100))] overflow-y-auto rounded-md bg-black p-4 text-white transition data-closed:opacity-0 data-ending-style:opacity-0 data-open:opacity-100 data-starting-style:opacity-0",
              className,
            )}
          >
            <Popover.Arrow
              render={(props, { side }) => (
                <div
                  {...props}
                  className={clsx(
                    "size-3 bg-black [clip-path:polygon(0%_0%,100%_0%,100%_100%,0_0%)]",
                    side === "top" &&
                      "top-full -translate-y-[calc(50%+1px)] rotate-135",
                    side === "bottom" &&
                      "bottom-full translate-y-[calc(50%+1px)] rotate-315",
                    side === "left" &&
                      "left-full -translate-x-[calc(50%+1px)] rotate-45",
                    side === "right" &&
                      "right-full translate-x-[calc(50%+1px)] rotate-225",
                  )}
                />
              )}
            />
            {content}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
