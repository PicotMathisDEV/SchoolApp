import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background bg-white">
      <div className="w-full max-w-md space-y-6 p6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-black">Bienvenue</h1>
        </div>
        <div className="flex flex-col gap-3">
          <Button asChild>
            <Link href="/signup">Créer un compte</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/login">Se connecter</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
