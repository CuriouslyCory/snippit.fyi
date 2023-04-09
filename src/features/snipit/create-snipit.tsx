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
import { SnipitTagInput } from "./snipit-tag-input";

const validationSchema = z.object({
  prompt: z
    .string()
    .min(1, { message: "Prompt is required" })
    .max(240, "Maximum prompt length is 240 characters"),
  isPublic: z.boolean(),
});

type SnipitInput = {
  prompt: string;
  isPublic: boolean;
};

export function CreateSnipit() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<Array<string>>([]);

  /**
   * Initialize useZodForm hook
   */
  const { formState, handleSubmit, register, reset, watch } = useZodForm({
    schema: validationSchema,
    defaultValues: {
      prompt: "",
      isPublic: false,
    },
  });

  // Get the length of the prompt for the character count
  const promptCharLength = watch("prompt").length;

  // Create snipit mutation
  const snipitMutation = api.snipit.createSnipit.useMutation();

  /**
   * Form Submit function
   * @param data pre-valdiated by zod validation schema
   */
  const onSubmit = async (data: SnipitInput) => {
    try {
      await snipitMutation.mutateAsync({ ...data, tags });
      toast({
        title: "Snipit created",
        description: "Your Snipit has been successfully created.",
      });
      setOpen(false);
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating the Snipit.",
        variant: "destructive",
      });
    }
  };

  /**
   * Default component state. Display the button to open the dialog
   */
  if (!open) {
    return <Button onClick={() => setOpen(true)}>Add new</Button>;
  }

  /**
   * Create snipit dialog
   */
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
            <Textarea {...register("prompt")} className="my-2" />
            <div className="flex justify-between">
              <div className="flex items-center gap-x-3">
                <Label htmlFor="isPublic">Make public</Label>
                <input type="checkbox" {...register("isPublic")} />
              </div>
              <div>{promptCharLength} / 240</div>
            </div>
            <div className="mt-3 flex flex-col">
              {formState.errors &&
                Object.entries(formState.errors).map(([key, value]) => (
                  <p className="text-red-700" key={`error-${key}`}>
                    {value.message}
                  </p>
                ))}
            </div>
            <SnipitTagInput setTags={setTags} />
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
