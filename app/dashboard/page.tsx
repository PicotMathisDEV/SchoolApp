"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignoutPrompt } from "@/src/components/signout-prompt";
import { signOut, useSession } from "@/src/lib/auth-client";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [showPrompt, setShowPrompt] = useState(false);
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading ...</p>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="absolute top-6 right-8">
          <Button className="flex flex-row items-center gap-2 p-2 bg-white text-black border border-black/20 hover:bg-white/80 cursor-pointer">
            <Avatar>
              <AvatarImage
                src={session?.user.image || "/user.svg"}
                alt="User Avatar"
              />
            </Avatar>
            <h2 className="font-semibold">{session?.user.name}</h2>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="font-semibold text-sm">
            Mon Compte
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Paramètres</DropdownMenuItem>
          <DropdownMenuItem>Mes parcours</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-500 font-semibold flex items-center gap-2 cursor-pointer"
            onClick={() => setShowPrompt(true)}
          >
            <LogOut className="text-red-500" />
            Se déconnecter
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showPrompt && <SignoutPrompt onCancel={() => setShowPrompt(false)} />}
    </div>
  );
}
