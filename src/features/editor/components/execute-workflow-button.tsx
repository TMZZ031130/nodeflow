import { FlaskConicalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ExecuteWorkflowButton = ({
  workflowId,
}: {
  workflowId: string;
}) => {
  return (
    <Button className="lg" onClick={() => {}} disabled={false}>
      <FlaskConicalIcon className="size-4" />
      Execute workflow
    </Button>
  );
};
