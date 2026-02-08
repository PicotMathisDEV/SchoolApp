import type { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import React, { useCallback, useRef } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code2,
  Minus,
  Undo2,
  Redo2,
  Eraser,
  Table as TableIcon,
  Merge,
  ArrowRightToLine,
  ArrowDownToLine,
  Trash2,
  XCircle,
  Link as LinkIcon,
  Image as ImageIcon,
  Ban,
  Heading4,
  Save,
} from "lucide-react";
import { menuBarStateSelector } from "./MenuBarState";
import { updateLesson } from "@/src/lib/actions/lesson-action";
import { toast } from "sonner";

type MenuBarProps = {
  editor: Editor | null;
  lesson: {
    name: string | null;
    id: string;
    content: string;
  };
};

const MenuButton = ({
  onClick,
  isActive,
  disabled,
  children,
  title,
  danger,
}: any) => (
  <button
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    disabled={disabled}
    title={title}
    className={`p-2 rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-blue-600 text-white shadow-md"
        : danger
          ? "text-red-500 hover:bg-red-50"
          : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
    } ${disabled ? "opacity-20 cursor-not-allowed" : "cursor-pointer active:scale-90"}`}
  >
    {children}
  </button>
);

const Divider = () => <div className="w-1px h-6 bg-slate-200 mx-1" />;

export const MenuBar = ({ editor, lesson }: MenuBarProps) => {
  const state = useEditorState({ editor, selector: menuBarStateSelector });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!editor) return;
    try {
      const currentHTML = editor.getHTML();
      await updateLesson(lesson.id, currentHTML);

      toast.success("Leçon mise à jour");
    } catch (err) {
      console.error("Erreur Prisma/Action:", err);
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL du lien :", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editor) {
      const reader = new FileReader();
      reader.onload = (e) => {
        editor
          .chain()
          .focus()
          .setImage({ src: e.target?.result as string })
          .run();
      };
      reader.readAsDataURL(file);
    }
  };

  if (!editor || !state) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-1 p-4 sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-blue-50">
      {/* 1. Historique */}
      <div className="flex items-center gap-0.5">
        <MenuButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!state.canUndo}
          title="Annuler"
        >
          <Undo2 size={18} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!state.canRedo}
          title="Rétablir"
        >
          <Redo2 size={18} />
        </MenuButton>
      </div>
      <Divider />

      {/* 2. Formatage & Médias */}
      <div className="flex items-center gap-0.5">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={state.isBold}
          title="Gras"
        >
          <Bold size={18} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={state.isItalic}
          title="Italique"
        >
          <Italic size={18} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={state.isStrike}
          title="Barré"
        >
          <Strikethrough size={18} />
        </MenuButton>
        <MenuButton onClick={setLink} isActive={state.isLink} title="Lien">
          <LinkIcon size={18} />
        </MenuButton>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
        />
        <MenuButton
          onClick={() => fileInputRef.current?.click()}
          title="Image PC"
        >
          <ImageIcon size={18} />
        </MenuButton>
      </div>
      <Divider />

      {/* 3. Titres (StarterKit) */}
      <div className="flex items-center gap-0.5">
        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={state.isHeading1}
          title="H1"
        >
          <Heading1 size={18} />
        </MenuButton>
        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={state.isHeading2}
          title="H2"
        >
          <Heading2 size={18} />
        </MenuButton>
        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={state.isHeading3}
          title="H3"
        >
          <Heading3 size={18} />
        </MenuButton>
        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          isActive={state.isHeading4}
          title="H4"
        >
          <Heading4 size={18} />
        </MenuButton>
      </div>
      <Divider />

      {/* 4. Listes & Blocs (StarterKit) */}
      <div className="flex items-center gap-0.5">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={state.isBulletList}
          title="Liste à puces"
        >
          <List size={18} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={state.isOrderedList}
          title="Liste ordonnée"
        >
          <ListOrdered size={18} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={state.isBlockquote}
          title="Citation"
        >
          <Quote size={18} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={state.isCodeBlock}
          title="Bloc Code"
        >
          <Code2 size={18} />
        </MenuButton>
      </div>
      <Divider />

      {/* 5. Tableaux (Extrait du TableKit manuel) */}
      <div className="flex items-center gap-0.5 bg-blue-50/50 p-1 rounded-xl border border-blue-100">
        <MenuButton
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
          title="Tableau"
        >
          <TableIcon size={18} className="text-blue-600" />
        </MenuButton>
        {state.isTable && (
          <>
            <Divider />
            <MenuButton
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              title="+ Col"
            >
              <ArrowRightToLine size={16} />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().deleteColumn().run()}
              title="- Col"
              danger
            >
              <XCircle size={16} />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().addRowAfter().run()}
              title="+ Ligne"
            >
              <ArrowDownToLine size={16} />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().deleteRow().run()}
              title="- Ligne"
              danger
            >
              <XCircle size={16} />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().mergeCells().run()}
              title="Fusionner"
            >
              <Merge size={16} />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().deleteTable().run()}
              title="Supprimer Table"
              danger
            >
              <Trash2 size={16} />
            </MenuButton>
          </>
        )}
      </div>

      <Divider />

      {/* 6. Outils divers */}
      <div className="flex items-center gap-0.5">
        <MenuButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Ligne"
        >
          <Minus size={18} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          title="Effacer styles"
        >
          <Eraser size={18} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().clearNodes().run()}
          title="Reset blocs"
        >
          <Ban size={18} />
        </MenuButton>
      </div>
      <div className="ml-6">
        <MenuButton title="Enregistrer votre travail" onClick={handleSubmit}>
          <Save size={18} />
        </MenuButton>
      </div>
    </div>
  );
};
