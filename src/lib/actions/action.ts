"use server";

import prisma from "@/src/lib/prisma";

import { auth } from "../auth";
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
}

export async function createStudentAndAssignToClass(
  email: string,
  password: string,
  name: string,
  role: "user",
  classeId: string,
) {
  if (!password && !name && !role && !classeId) throw new Error("Nom requis");
  const newStudent = await auth.api.createUser({
    body: {
      email: email,
      password: password,
      name: name,
      role: role,
    },
  });

  if (newStudent) {
    await prisma.classe.update({
      where: { id: classeId },
      data: {
        students: {
          connect: { id: newStudent.user.id },
        },
      },
    });
  }
  revalidatePath("/gestion");
  return newStudent;
}

export async function getOneClass(id: string) {
  return await prisma.classe.findUnique({
    where: { id },
    include: {
      students: true,
    },
  });
}

export async function RemoveStudentFromClass(
  studentId: string,
  classeId: string,
) {
  return await prisma.classe.update({
    where: { id: classeId },
    data: {
      students: {
        disconnect: { id: studentId },
      },
    },
  });
}

export async function RemoveClass(classeId: string) {
  return await prisma.classe.delete({
    where: { id: classeId },
  });
}

export async function ModifyClassName(classeId: string, newName: string) {
  await prisma.classe.update({
    where: { id: classeId },
    data: {
      name: newName,
    },
  });
}
