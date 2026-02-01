"use server";

import prisma from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createClassAction(
  name: string,
  teacherId: string,
  teacherName: string,
) {
  if (!name) throw new Error("Nom requis");

  await prisma.classe.create({
    data: {
      name: name,
      teacherId: teacherId,
      teacherName: teacherName,
    },
  });

  revalidatePath("/gestion");
}
