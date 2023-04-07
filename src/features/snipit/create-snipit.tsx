import { useState } from "react";
import { useToast } from "~/hooks/use-toast";
import { useZodForm } from "~/hooks/use-zod-form";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "~/components/ui/dialog";
import { z } from "zod";
import { api } from "~/utils/api";
import { Textarea } from "~/components/ui/textarea";
import { Checkbox } from "~/components/ui/checkbox";

const validationSchema = z.object({
  prompt: z.string().min(1, { message: "Prompt is required" }),
  isPublic: z.boolean(),
});

type SnipitInput = {
  prompt: string;
  isPublic: boolean;
};

export function CreateSnipit() {
  const [open, setOpen] = useState(false);
  const { formState, handleSubmit, register } = useZodForm({
    schema: validationSchema,
    defaultValues: {
      prompt: "",
      isPublic: false,
    },
  });
  const snipitMutation = api.snipit.createSnipit.useMutation();
  const { toast } = useToast();

  const onSubmit = async (data: SnipitInput) => {
    console.log("data", data);
    try {
      await snipitMutation.mutateAsync(data);
      toast({
        title: "Snipit created",
        description: "Your Snipit has been successfully created.",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating the Snipit.",
        variant: "destructive",
      });
    }
  };

  if (!open) {
    return <Button onClick={() => setOpen(true)}>Add new</Button>;
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create Snipit</DialogTitle>
              <DialogDescription>Create a new snipit</DialogDescription>
            </DialogHeader>
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea {...register("prompt")} />
            <Label htmlFor="isPublic" className="mt-2">
              <Checkbox {...register("isPublic")} />
              Make public
            </Label>
            <div className="mt-3 flex flex-col">
              {formState.errors &&
                Object.entries(formState.errors).map(([key, value]) => (
                  <p className="text-red-700" key={`error-${key}`}>
                    {value.message}
                  </p>
                ))}
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="mt-3"
                disabled={snipitMutation.isLoading}
              >
                {snipitMutation.isLoading ? "Processing..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
