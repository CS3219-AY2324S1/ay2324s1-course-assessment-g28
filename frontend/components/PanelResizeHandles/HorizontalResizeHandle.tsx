import { MoreHorizontal } from "lucide-react";
import { PanelResizeHandle } from "react-resizable-panels";

export default function HorizontalResizeHandle() {
  return (
    <PanelResizeHandle className="bg-background hover:bg-purple-300 bg-brand-white dark:bg-background grid place-content-center">
      <MoreHorizontal size={16} className="text-foreground" />
    </PanelResizeHandle>
  );
}
