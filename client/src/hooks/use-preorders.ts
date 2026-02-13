import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type insertPreorderSchema } from "@shared/routes";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

type PreorderInput = z.infer<typeof insertPreorderSchema>;

export function useCreatePreorder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: PreorderInput) => {
      // Validate locally first using the exact same schema
      const validated = api.preorders.create.input.parse(data);

      const res = await fetch(api.preorders.create.path, {
        method: api.preorders.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.preorders.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to submit preorder");
      }

      return api.preorders.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      toast({
        title: "Pre-order Confirmed",
        description: "Welcome to the future of driving. Check your email.",
        variant: "default",
        className: "bg-green-500 border-green-600 text-white",
      });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
