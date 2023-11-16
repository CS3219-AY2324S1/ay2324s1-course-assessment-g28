import { MoreVertical } from "lucide-react";
import { PanelResizeHandle } from "react-resizable-panels";

export default function VerticalResizeHandle() {
  return (
    <PanelResizeHandle className="bg-background hover:bg-purple-300 bg-brand-white dark:bg-background grid place-content-center">
      <MoreVertical size={16} className="text-foreground" />
    </PanelResizeHandle>
  );
}
