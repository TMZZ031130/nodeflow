"use server";

import { aiNodeChannel } from "@/inngest/channels/ai-node";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

export type AiNodeToken = Realtime.Token<typeof aiNodeChannel, ["status"]>;

export async function fetchAiNodeRealtimeToken(): Promise<AiNodeToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: aiNodeChannel(),
    topics: ["status"],
  });

  return token;
}
