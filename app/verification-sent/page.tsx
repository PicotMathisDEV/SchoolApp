"use client";

import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MailCheck } from "lucide-react";
import { authClient } from "@/src/lib/auth-client";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const userEmail = searchParams.get("email");

  const handleResend = async () => {
    if (!userEmail) return; // Sécurité si l'email est absent de l'URL

    await authClient.sendVerificationEmail({
      email: userEmail,
      callbackURL: "/", // Où rediriger après la validation
    });
  };

  return (
    <div className="bg-white flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-2">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <MailCheck className="h-6 w-6 text-primary" />
            </div>
          </div>

          <CardTitle>Email de vérification envoyé</CardTitle>

          <CardDescription>
            Nous avons envoyé un email de vérification à{" "}
            <strong>{userEmail}</strong>.
            <br />
            Veuillez cliquer sur le lien pour activer votre compte.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            onClick={handleResend}
            variant="outline"
            className="w-full cursor-pointer"
          >
            Renvoyer l’email de vérification
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
