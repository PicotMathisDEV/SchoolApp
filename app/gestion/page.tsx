"use client";
export const dynamic = "force-dynamic";

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
import { unauthorized } from "next/navigation";
import { useSession } from "@/src/lib/auth-client";
import { getClasses } from "@/src/lib/actions/get-classes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus } from "lucide-react";
interface Classe {
  id: string;
  name: string;
  students?: [];
}

export default function Page() {
  const [classes, setClasses] = useState<Classe[]>([]);
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

  if (session?.user.role != "teacher") {
    return unauthorized();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createClassAction(nameValue, session.user.id, session.user.name);
      window.location.reload();
      setnameValue("");
      toast.success("Classe créée !");
    } catch (error) {
      console.log(error);
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
      <div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-md transition-all active:scale-95 gap-2">
              <Plus className="w-4 h-4" /> Créer une classe
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl">
                Créer une nouvelle classe
              </AlertDialogTitle>
              <AlertDialogDescription>
                Cette action va créer une nouvelle classe
              </AlertDialogDescription>
            </AlertDialogHeader>
            <form className="grid gap-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700">
                    Nom de la classe
                  </Label>
                  <Input
                    id="name"
                    placeholder="ex: T01"
                    className="focus-visible:ring-blue-500"
                    onChange={(e) => setnameValue(e.target.value)}
                    required
                  />
                </div>
              </div>
            </form>
            <AlertDialogFooter>
              <AlertDialogCancel className="hover:cursor-pointer">
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="bg-blue-600! hover:bg-blue-700! hover:cursor-pointer"
              >
                {isSubmitting
                  ? "Création en cours..."
                  : "Confirmer la création"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
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
                    {`${item.students?.length} eleves`}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-4 pb-4">
              <Button className="bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer text-white p-3 rounded-xl text-sm ">
                <Link href={`/gestion/${item.id}`}>Gérer la classe</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
