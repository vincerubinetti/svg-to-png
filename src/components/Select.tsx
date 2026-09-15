import type { ComponentProps } from "react";
import { Select as _Select } from "@base-ui/react";
import { Check, ChevronDown } from "lucide-react";
import Button from "@/components/Button";

type Props<Option> = {
  options: Option[];
  value: Option;
  onChange: (value: Option) => void;
} & Omit<ComponentProps<"button">, "value" | "onChange">;

export default function Select<Option extends string>({
  options,
  value,
  onChange,
  ...props
}: Props<Option>) {
  return (
    <_Select.Root
      value={value}
      onValueChange={(value) => value && onChange(value)}
    >
      <_Select.Trigger render={(props) => <Button {...props} />} {...props}>
        <_Select.Value />
        <_Select.Icon>
          <ChevronDown />
        </_Select.Icon>
      </_Select.Trigger>

      <_Select.Positioner alignItemWithTrigger={false}>
        <_Select.Popup className="z-10 min-w-(--anchor-width) overflow-hidden rounded-md border border-gray bg-white shadow-lg">
          <_Select.List>
            {options.map((option) => (
              <_Select.Item
                key={option}
                className="flex cursor-pointer items-center justify-between gap-4 p-2 data-highlighted:bg-theme data-highlighted:text-white"
                value={option}
              >
                {option}
                <_Select.ItemIndicator>
                  <Check />
                </_Select.ItemIndicator>
              </_Select.Item>
            ))}
          </_Select.List>
        </_Select.Popup>
      </_Select.Positioner>
    </_Select.Root>
  );
}
