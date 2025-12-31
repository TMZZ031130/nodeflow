"use client";

import type { NodeProps } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { memo, useState } from "react";
import { PlaceholderNode } from "./placeholder-node";
import { WorkflowNode } from "./workflow-node";
import { NodeSelector } from "./node-selector";

export const InitialNode = memo((props: NodeProps) => {
  const [openSelector, setOpenSelector] = useState(false);
  return (
    <NodeSelector open={openSelector} onOpenChange={setOpenSelector}>
      <WorkflowNode showToolbar={false}>
        <PlaceholderNode {...props} onClick={() => setOpenSelector(true)}>
          <div className="size-4 cursor-pointer items-center justify-center flex">
            <PlusIcon className="size-4" />
          </div>
        </PlaceholderNode>
      </WorkflowNode>
    </NodeSelector>
  );
});
