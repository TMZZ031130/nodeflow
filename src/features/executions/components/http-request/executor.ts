import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { Options as KyOption } from "ky";
import Handlebars from "handlebars";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;
});

type HttpRequestData = {
  variableName: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  if (!data.endpoint) {
    throw new NonRetriableError("No endpoint");
  }

  if (!data.variableName) {
    throw new NonRetriableError("No variableName");
  }

  const result = await step.run("http-request", async () => {
    const endpoint = Handlebars.compile(data.endpoint)(context);
    const method = data.method;

    const options: KyOption = { method };

    if (["POST", "PUT", "PATCH"].includes(method)) {
      const resloved = Handlebars.compile(data.body || "{}")(context);
      JSON.parse(resloved);
      console.log(resloved);
      options.body = resloved;
      options.headers = {
        "Content-Type": "application/json",
      };
    }
    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type");
    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();
    const responsePayload = {
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };

    return {
      ...context,
      [data.variableName]: responsePayload,
    };
  });
  return result;
};
