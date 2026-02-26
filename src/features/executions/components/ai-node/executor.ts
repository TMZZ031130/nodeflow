import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import { aiNodeChannel } from "@/inngest/channels/ai-node";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;
});

type AiNodeData = {
  variableName?: string;
  // model?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

export const aiNodeExecutor: NodeExecutor<AiNodeData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    aiNodeChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  if (!data.variableName) {
    await publish(
      aiNodeChannel().status({
        nodeId,
        status: "error",
      }),
    );

    throw new NonRetriableError("Variable name is missing");
  }

  if (!data.userPrompt) {
    await publish(
      aiNodeChannel().status({
        nodeId,
        status: "error",
      }),
    );

    throw new NonRetriableError("User prompt is missing");
  }

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant.";

  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  const credentialValue = process.env.GOOGLE_GEMINI_API_KEY;

  const google = createGoogleGenerativeAI({
    apiKey: credentialValue,
  });

  try {
    const { steps } = await step.ai.wrap("gemini-generate-text", generateText, {
      model: google("gemini-2.5-flash"),
      system: systemPrompt,
      prompt: userPrompt,
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });

    const text =
      steps[0].content[0].type === "text" ? steps[0].content[0].text : "";

    console.log(text);

    await publish(
      aiNodeChannel().status({
        nodeId,
        status: "success",
      }),
    );
    return {
      ...context,
      [data.variableName]: {
        aiResponse: text,
      },
    };
  } catch (error) {
    await publish(
      aiNodeChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw error;
  }
};
