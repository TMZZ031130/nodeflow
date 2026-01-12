import { NodeStatus } from "@/components/node-status-indicator";
import { useInngestSubscription } from "@inngest/realtime/hooks";
import { Realtime } from "@inngest/realtime";
import { useEffect, useState } from "react";

interface useNodeStatusOptions {
  nodeId: string;
  channel: string;
  topic: string;
  refreshToken: () => Promise<Realtime.Subscribe.Token>;
}

export const useNodeStatus = ({
  nodeId,
  channel,
  topic,
  refreshToken,
}: useNodeStatusOptions) => {
  const [status, setStatus] = useState<NodeStatus>("initial");

  const { data } = useInngestSubscription({
    refreshToken,
    enabled: true,
  });

  useEffect(() => {
    if (!data?.length) {
      return;
    }

    const lastMessage = data
      .filter(
        (msg) =>
          msg.kind === "data" &&
          msg.channel === channel &&
          msg.topic === topic &&
          msg.data.nodeId === nodeId,
      )
      .sort((a, b) => {
        if (a.kind === "data" && b.kind === "data") {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        return 0;
      })[0];

    if (lastMessage?.kind === "data") {
      setStatus(lastMessage.data.status as NodeStatus);
    }
  }, [data, nodeId, channel, topic]);

  return status;
};
