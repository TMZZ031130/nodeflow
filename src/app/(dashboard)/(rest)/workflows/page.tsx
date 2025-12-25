import {
  WorkflowContainer,
  WorkflowsList,
} from "@/features/workflows/components/workflows";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
4;
import { ErrorBoundary } from "react-error-boundary";

const Page = async () => {
  await requireAuth();

  prefetchWorkflows();

  return (
    <WorkflowContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<p>Error...</p>}>
          <Suspense fallback={<p>Loading...</p>}>
            <WorkflowsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkflowContainer>
  );
};

export default Page;
