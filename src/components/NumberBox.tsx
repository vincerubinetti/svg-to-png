import type { ComponentProps } from "react";
import { NumberField } from "@base-ui/react";
import clsx from "clsx";
import { ChevronDown, ChevronUp, EllipsisVertical } from "lucide-react";

type Props = {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
} & Omit<ComponentProps<"input">, "value" | "onChange">;

export default function NumberBox({
  min = 1,
  max = 100,
  step = 1,
  value,
  onChange,
  className,
  ...props
}: Props) {
  return (
    <NumberField.Root
      className={clsx(
        "relative flex min-h-10 items-center rounded-md border border-gray tabular-nums hover:border-theme",
        className,
      )}
      min={min}
      max={max}
      step={step}
      smallStep={step / 10}
      largeStep={step * 10}
      value={value}
      onValueChange={(value) => {
        if (value !== null) onChange(value);
      }}
    >
      <NumberField.Input className="p-2 pr-6" {...props} />
      <div className="absolute inset-y-0 right-0 grid grid-rows-3 text-xs *:w-6">
        <NumberField.Increment
          render={
            <button>
              <ChevronUp />
            </button>
          }
        />
        <NumberField.ScrubArea
          direction="vertical"
          render={<EllipsisVertical className="cursor-ns-resize" />}
        />
        <NumberField.Decrement
          render={
            <button>
              <ChevronDown />
            </button>
          }
        />
      </div>
    </NumberField.Root>
  );
}
