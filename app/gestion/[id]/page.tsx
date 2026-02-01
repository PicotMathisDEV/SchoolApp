"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  createStudentAndAssignToClass,
  RemoveStudentFromClass,
} from "@/src/lib/actions/action";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getOneClass } from "@/src/lib/actions/action";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useSession } from "@/src/lib/auth-client";
import DropMenu from "@/app/_components/DropMenu";
import Image from "next/image";

interface Classe {
  id: string;
  name: string;
  students: {
    id: string;
    name: string;
    email: string;
    image: string;
  }[];
}

export default function Page() {
  const [showCard, setShowCard] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentClass, setCurrentClass] = useState<Classe | null>(null);

  const params = useParams();

  useEffect(() => {
    const fetchOneClass = async () => {
      if (params.id) {
        const data = await getOneClass(params.id as string);
        setCurrentClass(data);
      }
    };
    fetchOneClass();
  }, [params.id]);

  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  const buttonClick = () => {
    if (showCard === true) {
      setShowCard(false);
    } else {
      setShowCard(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      createStudentAndAssignToClass(
        email,
        name,
        name,
        "user",
        params.id as string,
      );
      setShowCard(false);
      setIsSubmitting(false);
      toast.success(`Eleve ajouté a la classe${currentClass?.name}`);
    } catch (err) {
      toast.error(
        `Erreur lors de l'ajout de l'eleve a la classe${currentClass?.name}`,
      );
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* Barre de navigation / Header */}
      <div className="border-b bg-white shadow-sm mb-8">
        <div className="max-w-7-xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2 rounded-lg text-white font-bold">
              {currentClass?.name?.toUpperCase() || "CL"}
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              Classe {currentClass?.name}
            </h1>
          </div>

          <DropMenu
            user={{
              name: session.user.name,
              email: session.user.email,
              image: session.user.image,
              role: session.user.role,
            }}
          />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 space-y-8">
        {/* Section Actions & Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-slate-500 text-sm">
              Gestion des élèves et des accès
            </p>
            <p className="text-2xl font-semibold text-slate-900">
              {currentClass?.students?.length || 0} Élèves inscrits
            </p>
          </div>

          <Button
            onClick={buttonClick}
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-md transition-all active:scale-95 gap-2"
          >
            <span className="text-lg">+</span> Ajouter un élève
          </Button>
        </div>

        {/* Formulaire dans une carte élégante */}
        {showCard && (
          <div className="max-w-2xl mx-auto animate-in fade-in zoom-in duration-300">
            <Card className="border-2 border-blue-100 shadow-xl">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">Nouvel Étudiant</CardTitle>
                <CardDescription>
                  Créez un compte élève pour la classe {currentClass?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="grid gap-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-700">
                        Nom de l&apos;eleve
                      </Label>
                      <Input
                        id="name"
                        placeholder="ex: Jean Dupont"
                        className="focus-visible:ring-blue-500"
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-700">
                        Email de l&apos;eleve
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="jean.dupont@ecole.com"
                        className="focus-visible:ring-blue-500"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 h-11 cursor-pointer hover:bg-blue-700"
                  >
                    {isSubmitting
                      ? "Création en cours..."
                      : "Confirmer l'inscription"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Grille des élèves améliorée */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentClass?.students.map((student) => (
            <Card
              key={student.id}
              className="group hover:border-blue-300 transition-all hover:shadow-lg overflow-hidden border-slate-200"
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative h-20 w-20">
                    <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse group-hover:hidden" />
                    <Image
                      src={student.image || "/user.svg"}
                      alt={student.name}
                      className="rounded-full border-2 border-white shadow-sm object-cover"
                      fill
                    />
                  </div>

                  <div className="space-y-1 text-center">
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {student.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium truncate max-w-45">
                      {student.email}
                    </p>
                  </div>

                  <div className="flex gap-2 w-full pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs hover:bg-slate-50"
                    >
                      Détails
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className=" hover:text-red-600 transition-colors text-red-600 "
                        >
                          Supprimer
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-xl">
                            Supprimer l&apos;élève ?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action va retirer{" "}
                            <strong>{student.name}</strong> de la classe{" "}
                            <strong>{currentClass?.name}</strong>. L&apos;élève
                            ne pourra plus accéder au contenu de cette classe.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={async () => {
                              try {
                                await RemoveStudentFromClass(
                                  student.id,
                                  currentClass.id,
                                );
                                toast.success(
                                  `${student.name} a été retiré de la classe avec succès.`,
                                );
                                // Optionnel : router.refresh() si tu veux recharger les données server-side
                              } catch (error) {
                                toast.error("Erreur lors de la suppression.");
                                console.log(error);
                              }
                            }}
                          >
                            Confirmer la suppression
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* État vide */}
        {currentClass?.students.length === 0 && !showCard && (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-white/50">
            <div className="text-4xl mb-4">📚</div>
            <p className="text-slate-500 font-medium">
              Cette classe est encore vide.
            </p>
            <p className="text-slate-400 text-sm">
              Commencez par ajouter votre premier élève.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
