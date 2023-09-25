import { Button, Chip, Input } from "@nextui-org/react";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

interface CategoryAdderProps {
  categories: string[];
  onChange: (cats: string[]) => void;
}
export default function CategoryAdder({
  categories,
  onChange,
}: CategoryAdderProps) {
  const [newCategory, setNewCategory] = useState<string>();
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex flex-row gap-x-2">
        <Input
          label="Add new category"
          onValueChange={setNewCategory}
          classNames={{
            input: "text-black",
          }}
          size="sm"
        />
        <Button
          isIconOnly
          title="Add Category"
          onClick={() => {
            if (newCategory) {
              const s = new Set([...categories, newCategory]);
              onChange(Array.from(s));
              setNewCategory("");
            }
          }}
        >
          <Plus />
        </Button>
      </div>
      <div className="flex flex-row gap-x-1">
        {categories.map((cat) => (
          <Chip
            key={cat}
            onClose={() => {
              const cats = categories.filter((x) => x !== cat);
              onChange(cats);
            }}
          >
            {cat}
          </Chip>
        ))}
      </div>
    </div>
  );
}
