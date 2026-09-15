import type { ComponentProps, ReactNode } from "react";
import { Checkbox as _CheckBox } from "@base-ui/react";
import clsx from "clsx";
import { Check } from "lucide-react";
import Button from "@/components/Button";

type Props = {
  value: boolean;
  onChange: (value: boolean) => void;
  children?: ReactNode;
} & Omit<ComponentProps<typeof _CheckBox.Root>, "value" | "onChange">;

export default function CheckBox({
  value,
  onChange,
  className,
  children,
  ...props
}: Props) {
  return (
    <label
      className={clsx("flex cursor-pointer items-center gap-2", className)}
    >
      <_CheckBox.Root
        nativeButton
        checked={value}
        onCheckedChange={onChange}
        render={(props, { checked }) => (
          <Button className="size-6 min-h-0! min-w-0!" {...props}>
            {checked && <Check />}
          </Button>
        )}
        {...props}
      />

      {children}
    </label>
  );
}
