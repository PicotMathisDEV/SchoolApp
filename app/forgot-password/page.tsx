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
import { requestPasswordReset, resetPassword } from "@/src/lib/auth-client";
import Link from "next/link";
import { useState, FormEvent } from "react";
import { toast, Toaster } from "sonner";
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const { data, error } = await requestPasswordReset({
        email,
        redirectTo: "/resetpassword",
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success(
          <div className="text-sm ">
            Email de réinitialisation du mot de passe envoyé
          </div>,
          { duration: 6000 }
        );
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className=" bg-white flex min-h-screen items-center justify-center">
      {" "}
      <Toaster />
      <Card className="flex w-full max-w-md justify-center ">
        {" "}
        <CardHeader className="flex flex-col items-center text-center">
          {" "}
          <CardTitle>Mot de passe oublié</CardTitle>{" "}
          <CardDescription>
            {" "}
            Entrez votre mail pour changer votre mot de passe{" "}
          </CardDescription>{" "}
        </CardHeader>{" "}
        <CardContent>
          {" "}
          <form onSubmit={handleSubmit} className="space-y-4">
            {" "}
            <div className="space-y-2">
              {" "}
              <Label htmlFor="email">Email</Label>{" "}
              <Input
                id="email"
                type="email"
                placeholder="Jean@exemple.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (err) setErr("");
                }}
                onBlur={() => {
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(email)) {
                    setErr("Veuillez entrer une adresse email valide");
                  }
                }}
                required
              />{" "}
            </div>{" "}
            {err && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {" "}
                {err}{" "}
              </div>
            )}{" "}
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={loading}
            >
              {" "}
              {loading ? "Envoie du mail..." : "Envoyer un e-mail"}{" "}
            </Button>{" "}
          </form>{" "}
        </CardContent>{" "}
        <div className="mt-4 space-y-2 text-center text-sm ">
          {" "}
          <div>
            {" "}
            Vous avez deja un compte ?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-semibold"
            >
              {" "}
              Se connecter{" "}
            </Link>{" "}
          </div>{" "}
        </div>{" "}
      </Card>{" "}
    </div>
  );
}
