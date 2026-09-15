import type { ComponentProps, ReactNode } from "react";
import { Checkbox as _Checkbox } from "@base-ui/react";
import clsx from "clsx";
import { Check } from "lucide-react";
import Button from "@/components/Button";

type Props = {
  value: boolean;
  onChange: (value: boolean) => void;
  children?: ReactNode;
} & Omit<ComponentProps<typeof _Checkbox.Root>, "value" | "onChange">;

export default function CheckBox({
  children,
  value,
  onChange,
  className,
  ...props
}: Props) {
  return (
    <label
      className={clsx("flex cursor-pointer items-center gap-2", className)}
    >
      <_Checkbox.Root
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
