"use client";

import type { NodeProps, Node } from "@xyflow/react";
import { BaseExecutionNode } from "./base-execution-node";
import { Bot } from "lucide-react";
import { memo, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { AiNodeDialog, AVAILABLE_MODELS } from "./dialog";
import type { AiNodeFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchAiNodeRealtimeToken } from "./actions";
import { aiNodeChannel } from "@/inngest/channels/ai-node";

type AiNodeData = {
  variableName?: string;
  model?: string;
  systemPrompt?: string;
  userPrompt?: string;
};
type AiNodeType = Node<AiNodeData>;

export const AiNode = memo((props: NodeProps<AiNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: aiNodeChannel().name,
    topic: "status",
    refreshToken: fetchAiNodeRealtimeToken,
  });

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  const handleSubmit = (values: AiNodeFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }
        return node;
      }),
    );
    setDialogOpen(false);
  };

  const nodeData = props.data;
  const description = nodeData?.userPrompt
    ? `${nodeData.model || AVAILABLE_MODELS[0]} ${nodeData.userPrompt.slice(0, 50)}...`
    : "Not Configured";

  return (
    <>
      <AiNodeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        icon={Bot}
        name="AI"
        description={description}
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

AiNode.displayName = "AiNode";
