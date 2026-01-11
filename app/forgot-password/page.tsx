"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [succes, setSucces] = useState(false);

  const handleSubmit = () => {
    return;
  };
  return (
    <div className=" bg-white flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Récupérer mon compte</CardTitle>
          <CardDescription>
            Recevoir un mail de réinitialisation du mot de passe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Jean@exemple.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                onBlur={() => {
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(email)) {
                    setError("Veuillez entrer une adresse email valide");
                  }
                }}
                required
              />
            </div>
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Envoie du mail..." : "Envoyer un e-mail"}{" "}
            </Button>
          </form>
        </CardContent>
        <div className="mt-4 space-y-2 text-center text-sm ">
          <div>
            Vous avez deja un compte ?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-semibold"
            >
              Se connecter{" "}
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
