"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/src/lib/auth-client";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { toast, Toaster } from "sonner";

export default function ResetpasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = new URLSearchParams(window.location.search).get("token");

      if (!token) {
        setError("Token manquant dans l'URL");
        toast.error("Token manquant dans l'URL");
        setLoading(false);
        return;
      }

      const { data, error: resetError } = await resetPassword({
        newPassword: password,
        token: token ?? undefined,
      });

      if (data) {
        console.log("reset response:", data);
      }

      if (resetError) {
        setError(resetError.message || "sadge");
        toast.error(<div className="text-sm">{resetError.message}</div>);
      } else {
        toast.success(
          <div className="text-sm">Mot de passe modifié avec succès</div>,
        );
        setTimeout(() => {
          router.push("/login");
        }, 500);
      }
    } catch (err) {
      setError("Une erreur est survenue");
      toast.error("Une erreur est survenue");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-white flex min-h-screen items-center justify-center">
      <Toaster />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Changer de mot de passe</CardTitle>
          <CardDescription>Entrez votre nouveau mot de passe</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nouveau mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2"
              />
            </div>
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={loading}
            >
              {loading
                ? "Changement du Mot de passe"
                : "Changer mon mot de passe"}{" "}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
