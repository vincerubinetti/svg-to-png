import type { ReactNode } from "react";
import { Info } from "lucide-react";
import Tooltip from "@/components/Tooltip";

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
