"use client";

import { useEffect, useState } from "react";
import DropMenu from "../_components/DropMenu";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createClassAction } from "@/src/lib/actions/action";
import { toast } from "sonner";
import { unauthorized, useRouter } from "next/navigation";
import { useSession } from "@/src/lib/auth-client";
import { getClasses } from "@/src/lib/actions/get-classes";
import Image from "next/image";

interface Classe {
  id: string;
  name: string;
}

export default function Page() {
  const [classes, setClasses] = useState<Classe[]>([]);
  const [showCard, setShowCard] = useState(false);
  const [nameValue, setnameValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      const data = await getClasses();
      setClasses(data);
    };

    fetchClasses();
  }, []);

  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/dashboard");
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
  if (session?.user.role != "teacher") {
    return unauthorized();
  }
  console.log(classes);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createClassAction(nameValue, session.user.id, session.user.name);
      setShowCard(false);
      setnameValue("");
      toast.success("Classe créée !");
    } catch (error) {
      toast.error("Erreur lors de la création");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <DropMenu
        user={{
          name: session?.user?.name,
          email: session?.user?.email,
          image: session?.user?.image,
          role: session?.user?.role,
        }}
      />

      <Button onClick={() => setShowCard(true)} className="mt-4">
        Créer une classe
      </Button>

      {showCard && (
        <Card className="max-w-xl mt-4">
          <CardContent className="p-4">
            <CardTitle className="mb-4">Créer une classe</CardTitle>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="className">Nom de la classe</Label>
                  <Input
                    id="className"
                    value={nameValue}
                    onChange={(e) => setnameValue(e.target.value)}
                    placeholder="ex: T01"
                    required
                  />
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Création..." : "Confirmer"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {classes.map((item) => (
          <Card
            key={item.id}
            className="group overflow-hidden border-none shadow-md transition-all hover:shadow-lg"
          >
            <div className="relative h-32 overflow-hidden rounded-t-lg">
              <Image
                src="/classes.png"
                alt="Avatar"
                fill
                priority
                className="object-cover object-top"
              />
            </div>

            <CardHeader className="">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-bold leading-none">
                    Classe de {item.name}
                  </CardTitle>
                  <CardDescription className="flex items-center text-sm font-medium text-muted-foreground">
                    <span className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                    31 élèves
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-4 pb-4">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer">
                Gérer la classe
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
