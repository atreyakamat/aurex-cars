import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button-custom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreatePreorder } from "@/hooks/use-preorders";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const variants = ["Stealth Black", "Quantum Silver", "Nebula Blue", "Mars Red"];

export function PreorderModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [variant, setVariant] = useState(variants[0]);
  
  const createPreorder = useCreatePreorder();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPreorder.mutate(
      { name, email, variant },
      {
        onSuccess: () => {
          setOpen(false);
          setName("");
          setEmail("");
          setVariant(variants[0]);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="glass-panel border-white/10 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display tracking-widest text-center text-glow">
            SECURE YOUR AUREX X1
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-gray-400">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/5 border-white/10 text-white focus:border-primary/50"
              placeholder="John Doe"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-gray-400">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border-white/10 text-white focus:border-primary/50"
              placeholder="john@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="variant" className="text-gray-400">Select Variant</Label>
            <Select value={variant} onValueChange={setVariant}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select a variant" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/10 text-white">
                {variants.map((v) => (
                  <SelectItem key={v} value={v} className="focus:bg-white/10 focus:text-primary cursor-pointer">
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            type="submit" 
            className="w-full mt-4" 
            variant="neon"
            disabled={createPreorder.isPending}
          >
            {createPreorder.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Reservation"
            )}
          </Button>
          <p className="text-xs text-center text-gray-500 mt-2">
            No payment required today. Limited allocation available.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
