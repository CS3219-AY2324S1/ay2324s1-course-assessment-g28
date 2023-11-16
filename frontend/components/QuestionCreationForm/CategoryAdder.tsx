import { Button, Chip, Input } from "@nextui-org/react";
import { Plus } from "lucide-react";
import { KeyboardEvent, useCallback, useState } from "react";

interface CategoryAdderProps {
  categories: string[];
  onChange: (cats: string[]) => void;
}
export default function CategoryAdder({
  categories,
  onChange,
}: CategoryAdderProps) {
  const [newCategory, setNewCategory] = useState<string>();
  const addCategory = useCallback(() => {
    if (newCategory) {
      const s = new Set([...categories, newCategory]);
      onChange(Array.from(s));
      setNewCategory("");
    }
  }, [newCategory, categories, onChange]);

  const addCategoryEnterKeyCallback = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        addCategory();
        e.preventDefault();
      }
    },
    [addCategory],
  );

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex flex-row gap-x-2">
        <Input
          label="Add new category"
          onValueChange={setNewCategory}
          onKeyDown={addCategoryEnterKeyCallback}
          size="sm"
        />
        <Button isIconOnly title="Add Category" onPress={addCategory}>
          <Plus />
        </Button>
      </div>
      <div className="flex flex-row gap-1 flex-wrap">
        {categories.map((cat) => (
          <Chip
            key={cat}
            className="flex-shrink-0"
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
