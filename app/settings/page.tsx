"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SignoutPrompt } from "@/src/components/signout-prompt";
import { useSession } from "@/src/lib/auth-client";
import EditSettings from "../_components/EditSettings";
import DropMenu from "../_components/DropMenu";

export default function SettingsPage() {
  const { data: session, isPending } = useSession();
  const [showPrompt, setShowPrompt] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className=" px-6 py-4 ">
        <DropMenu
          user={{
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
            role: session.user.role,
          }}
        />
      </header>

      <main>
        <EditSettings
          user={{
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
          }}
        />
      </main>

      {showPrompt && <SignoutPrompt onCancel={() => setShowPrompt(false)} />}
    </div>
  );
}
