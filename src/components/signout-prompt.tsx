"use client";

import { signOut } from "../lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface SignoutPromptProps {
  onCancel: () => void;
}

export function SignoutPrompt({ onCancel }: SignoutPromptProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="p-6 flex flex-col items-center gap-4 w-80 rounded-xl shadow-lg border border-gray-400 bg-white">
        <CardTitle className="text-base font-semibold text-gray-900 text-center">
          Êtes-vous sûr de vouloir vous déconnecter ?
        </CardTitle>
        <CardContent className="flex flex-row gap-3 mt-4 w-full justify-center">
          <Button
            variant="outline"
            className="flex-1 border-gray-900  cursor-pointer"
            onClick={handleSignOut}
          >
            Oui
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-gray-500 text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={onCancel}
          >
            Annuler
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
