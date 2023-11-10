import Menubar from "@/components/QuestionDescription/Menubar";
import { useEditor, EditorContent, Content } from "@tiptap/react";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import { TipTapCustomImage } from "@/components/QuestionDescription/TipTapCustomImage";
import { cn } from "@nextui-org/react";

export interface QuestionDescriptionProps {
  initialContent: Content;
  onChange?: (content: Content) => void;
  readonly?: boolean;
  className?: string;
}

export default function QuestionDescription({
  initialContent,
  onChange,
  readonly,
  className,
}: QuestionDescriptionProps) {
  const editor = useEditor({
    editable: !readonly ?? true,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert outline-none w-full max-w-full min-h-[500px]",
      },
    },
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle,
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        gapcursor: false,
      }),
      TipTapCustomImage,
      Typography,
      Superscript,
      Subscript,
    ],
    content: initialContent,
    onUpdate({ editor }) {
      if (onChange) {
        onChange(editor?.getJSON());
      }
    },
  });

  return (
    <div
      className={cn(
        "bg-default-100 p-2 flex flex-col gap-y-2 rounded-lg grow overflow-auto",
        className,
      )}
    >
      {!readonly && <Menubar editor={editor} />}
      <EditorContent editor={editor} className="max-h-full overflow-auto" />
    </div>
  );
}
