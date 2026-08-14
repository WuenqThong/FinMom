import { Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function CloneToRuleEngineButton({ className }: { className?: string }) {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <Button
      type="button"
      className={cn("rounded-full gap-2", className)}
      onClick={() => {
        toast({
          title: "Mở Rule Engine",
          description: "Clone bản demo vào Rule Engine để chỉnh sửa (Luồng đầy đủ sẽ có ở bản sau).",
        });
        navigate("/rule-engine-and-analysis");
      }}
    >
      <Workflow className="h-4 w-4" />
      Clone to Rule Engine
    </Button>
  );
}
