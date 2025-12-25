import { createTRPCRouter } from "../init";
import { workflowRouter } from "@/features/workflows/server/routes";

export const appRouter = createTRPCRouter({
  workflows: workflowRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
