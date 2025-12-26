"use client";

import {
  EntityContainer,
  EntityHeader,
  EntityPagination,
  EntitySearch,
} from "@/components/entity-components";
import {
  useCreateWorkflow,
  useSuspenseWorkflows,
} from "../hooks/use-workflows";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";

export const WorkflowsSearch = () => {
  const [params, setParams] = useWorkflowsParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });

  return (
    <EntitySearch
      placeholder="Search workflows"
      value={searchValue}
      onChange={onSearchChange}
    />
  );
};

export const WorkflowsList = () => {
  const workflows = useSuspenseWorkflows();

  return <p>{JSON.stringify(workflows.data, null, 2)}</p>;
};

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
  const createWorkflow = useCreateWorkflow();

  const handleCreate = () => {
    createWorkflow.mutate(undefined, {
      onError: (error) => {
        console.error(error);
      },
    });
  };
  return (
    <EntityHeader
      title="Workflows"
      description="Create and manage your workflows"
      onNew={handleCreate}
      newButtonLabel="New workflow"
      disabled={disabled}
      isCreating={createWorkflow.isPending}
    />
  );
};

export const WorkflowsPagination = () => {
  const [params, setParams] = useWorkflowsParams();
  const workflows = useSuspenseWorkflows();

  return (
    <EntityPagination
      disabled={workflows.isFetching}
      totalPages={workflows.data.totalPages}
      page={workflows.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const WorkflowContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<WorkflowsHeader />}
      search={<WorkflowsSearch />}
      pagination={<WorkflowsPagination />}
    >
      {children}
    </EntityContainer>
  );
};
