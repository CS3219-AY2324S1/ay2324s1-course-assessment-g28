import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { Editor } from "@tiptap/react";
import { ImagePlus } from "lucide-react";

interface MenubarProps {
  editor: Editor | null;
}

const Menubar = ({ editor }: MenubarProps) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col sticky">
      <div className="flex flex-row flex-wrap gap-1">
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          size="sm"
          variant={editor.isActive("bold") ? "solid" : "bordered"}
          color="secondary"
        >
          bold
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          size="sm"
          variant={editor.isActive("italic") ? "solid" : "bordered"}
          color="secondary"
        >
          italic
        </Button>
        <Button
          onClick={() => editor.chain().focus().setParagraph().run()}
          size="sm"
          variant={editor.isActive("paragraph") ? "solid" : "bordered"}
          color="secondary"
        >
          paragraph
        </Button>
        <Button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          size="sm"
          variant={
            editor.isActive("heading", { level: 1 }) ? "solid" : "bordered"
          }
          color="secondary"
        >
          h1
        </Button>
        <Button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          size="sm"
          variant={
            editor.isActive("heading", { level: 2 }) ? "solid" : "bordered"
          }
          color="secondary"
        >
          h2
        </Button>
        <Button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          size="sm"
          variant={
            editor.isActive("heading", { level: 3 }) ? "solid" : "bordered"
          }
          color="secondary"
        >
          h3
        </Button>
        <Button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          size="sm"
          variant={
            editor.isActive("heading", { level: 4 }) ? "solid" : "bordered"
          }
          color="secondary"
        >
          h4
        </Button>
        <Button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          size="sm"
          variant={
            editor.isActive("heading", { level: 5 }) ? "solid" : "bordered"
          }
          color="secondary"
        >
          h5
        </Button>
        <Button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
          size="sm"
          variant={
            editor.isActive("heading", { level: 6 }) ? "solid" : "bordered"
          }
          color="secondary"
        >
          h6
        </Button>
        <Button
          onClick={() =>
            editor.chain().focus().unsetSuperscript().toggleSubscript().run()
          }
          size="sm"
          variant={editor.isActive("subscript") ? "solid" : "bordered"}
          color="secondary"
          title="Toggle Subscript"
        >
          <p className="text-md">
            x<sub>2</sub>
          </p>
        </Button>
        <Button
          onClick={() =>
            editor.chain().focus().unsetSubscript().toggleSuperscript().run()
          }
          size="sm"
          variant={editor.isActive("superscript") ? "solid" : "bordered"}
          color="secondary"
          title="Toggle Superscript"
        >
          <p className="text-md">
            x<sup>2</sup>
          </p>
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          size="sm"
          variant={editor.isActive("bulletList") ? "solid" : "bordered"}
          color="secondary"
        >
          bullet list
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          size="sm"
          variant={editor.isActive("orderedList") ? "solid" : "bordered"}
          color="secondary"
        >
          ordered list
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleCode().run()}
          size="sm"
          variant={editor.isActive("code") ? "solid" : "bordered"}
          color="secondary"
        >
          code
        </Button>
        <Popover placement="bottom">
          <PopoverTrigger>
            <Button size="sm" variant="flat" color="secondary">
              <ImagePlus />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2">
              <div className="text-small font-bold text-black">Add Image</div>
              <div className="text-tiny text-black">
                Drag and drop images at the position in the description editor
                you wish to place them at. Alternatively, you may copy and paste
                images.
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Menubar;
