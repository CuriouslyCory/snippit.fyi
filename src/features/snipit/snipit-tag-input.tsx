import { type KeyboardEvent, useCallback, useState, useEffect } from "react";
import { Tag } from "~/components/ui/tag";

type SnipitTagInputProps = {
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
};

export const SnipitTagInput: React.FC<SnipitTagInputProps> = ({ setTags }) => {
  const [inputValue, setInputValue] = useState("");
  const [tags, setLocalTags] = useState<string[]>([]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (["Enter", ",", "Tab"].includes(e.key)) {
        e.preventDefault();
        if (inputValue.trim() !== "" && !tags.includes(inputValue)) {
          setLocalTags((prevTags) => {
            const newTags = [...prevTags, inputValue];
            return newTags;
          });
          setInputValue("");
        }
      }
    },
    [inputValue, tags]
  );

  const removeTag = (index: number) => {
    setLocalTags((prevTags) => {
      const newTags = prevTags.filter((_, i) => i !== index);
      return newTags;
    });
  };

  useEffect(() => {
    setTags(tags);
  }, [tags, setTags]);

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter tags"
        className="rounded border p-2"
      />
      <div className="mt-2">
        {tags.map((tag, index) => (
          <Tag key={tag} label={tag} onRemove={() => removeTag(index)} />
        ))}
      </div>
    </div>
  );
};
