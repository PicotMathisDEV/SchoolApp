"use client";

import DropMenu from "@/app/_components/DropMenu";
import SimpleEditor from "@/components/TipTapComp/simple/simple-editor";
import { getOneLesson } from "@/src/lib/actions/lesson-action";
import { useSession } from "@/src/lib/auth-client";
import { unauthorized, useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Lesson {
  id: string;
  title: string;
  teacherId: string;
  teacherName: string;
  content: string;
}

export default function Page() {
  // Correction 1: On attend une seule leçon (objet), pas un tableau []
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);

  const params = useParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    const fetchLesson = async () => {
      if (params.id) {
        // getOneLesson renvoie un objet leçon
        const data = await getOneLesson(params.id as string);
        setCurrentLesson(data);
      }
    };
    fetchLesson();
  }, [params.id]);

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

  if (!session?.user) return null;
  if (session.user.role !== "teacher") return unauthorized();

  // Correction 2: Attendre que currentLesson soit chargé avant d'afficher l'éditeur
  if (!currentLesson) return <p>Chargement de la leçon...</p>;

  return (
    <div>
      <div className="mb-4">
        <DropMenu
          user={{
            name: session.user.name || "",
            email: session.user.email || "",
            image: session.user.image || undefined,
            role: session.user.role || "",
          }}
        />
      </div>
      <div>
        <SimpleEditor
          lesson={{
            content: currentLesson.content,
            name: currentLesson.title,
            id: currentLesson.id,
          }}
        />
      </div>
    </div>
  );
}
