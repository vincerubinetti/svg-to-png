import type { ComponentProps } from "react";
import { Checkbox as _CheckBox } from "@base-ui/react";
import { Check } from "lucide-react";
import Button from "@/components/Button";

type Props = {
  value: boolean;
  onChange: (value: boolean) => void;
} & Omit<ComponentProps<typeof _CheckBox.Root>, "value" | "onChange">;

export default function CheckBox({ value, onChange, ...props }: Props) {
  return (
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
  );
}
