"use server";

import prisma from "@/src/lib/prisma";
import { headers } from "next/headers";
import { auth } from "../auth";

export const createLesson = async (
  title: string,
  content: string,
  teacherId: string,
  teacherName: string,
) => {
  if (!title) throw new Error("Nom requis");
  return await prisma.lesson.create({
    data: {
      title,
      content,
      teacherName,
      teacherId,
    },
  });
};

export async function getLessons() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Non autorisé");
  }

  return await prisma.lesson.findMany({
    where: {
      teacherId: session.user.id,
    },
  });
}

export async function getOneLesson(id: string) {
  return await prisma.lesson.findUnique({
    where: { id },
  });
}

export async function updateLesson(id: string, content: string) {
  return await prisma.lesson.update({
    where: { id },
    data: {
      content,
    },
  });
}
