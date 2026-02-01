"use server";

import { headers } from "next/headers";
import { auth } from "../auth";
import prisma from "../prisma";

export async function getClasses() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Non autorisé");
  }

  return await prisma.classe.findMany({
    where: {
      teacherId: session.user.id,
    },
    include: {
      students: true,
    },
  });
}
