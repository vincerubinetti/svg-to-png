import Tooltip from "@/components/Tooltip";
import { Info } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Help({ children }: Props) {
  return (
    <Tooltip content={children}>
      <div
        className="text-gray transition hover:text-dark-gray"
        aria-label="Help"
      >
        <Info />
      </div>
    </Tooltip>
  );
}
