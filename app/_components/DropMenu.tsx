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
import {
  Bookmark,
  LayoutDashboard,
  LogOut,
  Presentation,
  Settings,
  ShieldUser,
  Star,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  user: {
    name: string | null;
    email: string | null;
    image: string | null | undefined;
    role: string | null | undefined;
  };
};

const DropMenu = ({ user }: Props) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const router = useRouter();

  const settings = () => router.push("/settings");
  const dashboard = () => router.push("/dashboard");
  const gestion = () => router.push("/gestion");

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="absolute top-6 right-8">
          <Button className="flex flex-row items-center gap-2 p-2 bg-white text-black border border-black/20 hover:bg-white/80 cursor-pointer">
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
              <Image
                src={user?.image ?? "/user.svg"}
                alt="Avatar"
                fill
                className="object-cover"
              />
            </div>
            <h2 className="font-semibold">{user?.name}</h2>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="font-semibold text-sm">
            Mon Compte
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer bg-gray-200"
            onClick={dashboard}
          >
            <LayoutDashboard /> Dashboard
          </DropdownMenuItem>

          {user.role === "admin" && <DropdownMenuSeparator />}
          {user?.role === "admin" && (
            <DropdownMenuItem className="cursor-pointer" onClick={gestion}>
              <ShieldUser /> Gestion Eleves & Classes
            </DropdownMenuItem>
          )}
          {user.role === "admin" && <DropdownMenuSeparator />}
          {user?.role === "admin" && (
            <DropdownMenuItem className="cursor-pointer">
              <Presentation /> Creer un parcours
            </DropdownMenuItem>
          )}
          {user?.role === "admin" && (
            <DropdownMenuItem className="cursor-pointer">
              <Bookmark /> Creer une lesson
            </DropdownMenuItem>
          )}
          {user?.role === "admin" && (
            <DropdownMenuItem className="cursor-pointer">
              <Star /> Creer un quizz
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <Presentation /> Parcours
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <Bookmark /> Lessons
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Star /> Quizz
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={settings}>
            <Settings /> Paramètres
          </DropdownMenuItem>
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
};

export default DropMenu;
