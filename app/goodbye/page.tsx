"use client";

import React from "react";
import Link from "next/link";
import { Home, UserRoundX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Goodbye() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <div className="flex justify-center">
          <div className="p-4 bg-muted rounded-full">
            <UserRoundX />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Au revoir
          </h1>
          <p className="text-muted-foreground text-lg">
            Ton compte a été supprimé avec succès. Tes données ont été effacées
            de nos serveurs.
          </p>
        </div>

        <div className="p-6 bg-muted/50 rounded-2xl border border-border/50">
          <p className="text-sm text-muted-foreground italic">
            Merci d&apos;avoir fait partie de l&apos;aventure. A bientot !
          </p>
        </div>

        <div className="pt-4">
          <Button asChild variant="outline" className="gap-2 group">
            <Link href="/">
              <Home className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
              Retour à l&apos;accueil
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
