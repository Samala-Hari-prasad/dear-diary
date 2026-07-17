import { ChangeEvent, useState, useRef, useEffect } from "react";
import { Heart, Archive, Trash2, Edit2 } from "lucide-react";

interface EditorHeaderProps {
  title: string;
  createdAt: string;
  tags: string[];
  favorite?: boolean;
  archived?: boolean;
  onTitleChange: (newTitle: string) => void;
  onTagsChange: (newTags: string[]) => void;
  onFavoriteToggle?: () => void;
  onArchiveToggle?: () => void;
  onDelete?: () => void;
  mode: "read" | "edit";
}

export function EditorHeader({
  title,
  createdAt,
  tags,
  favorite = false,
  archived = false,
  onTitleChange,
  onTagsChange,
  onFavoriteToggle,
  onArchiveToggle,
  onDelete,
  mode,
}: EditorHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(mode === "edit");
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Sync mode changes to local editing state
  useEffect(() => {
    setIsEditingTitle(mode === "edit");
  }, [mode]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current && mode === "read") {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle, mode]);

  const formattedDate = new Date(createdAt).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleTagsTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    const list = e.target.value
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter((t) => t.length > 0);
    onTagsChange(list);
  };

  return (
    <div className="flex flex-col gap-3 border-b border-border/80 pb-6 mb-6 text-left">
      <div className="flex items-center justify-between gap-4 group">
        {isEditingTitle ? (
          <input
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            onBlur={() => mode === "read" && setIsEditingTitle(false)}
            onKeyDown={(e) => e.key === "Enter" && mode === "read" && setIsEditingTitle(false)}
            className="flex-1 bg-transparent border-none outline-none font-heading text-3xl font-light text-foreground placeholder:text-foreground/25 tracking-wide focus:ring-0 p-0 focus:outline-none"
            placeholder="Untitled Memory"
            aria-label="Memory Title"
          />
        ) : (
          <div className="flex items-center gap-3 flex-1 cursor-text" onClick={() => setIsEditingTitle(true)}>
            <h2 className="font-heading text-3xl font-light tracking-wide text-foreground leading-tight md:text-4xl">
              {title || "Untitled Memory"}
            </h2>
            <Edit2 className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />
          </div>
        )}

        {/* Favorite & Archive Toggle Controls */}
        <div className="flex gap-2 select-none">
          {onFavoriteToggle && (
            <button
              type="button"
              onClick={onFavoriteToggle}
              className={`p-1.5 rounded-sm hover:bg-foreground/5 transition-colors ${
                favorite ? "text-red-400" : "text-foreground/45"
              }`}
              aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart size={16} fill={favorite ? "currentColor" : "none"} strokeWidth={1.5} />
            </button>
          )}
          {onArchiveToggle && (
            <button
              type="button"
              onClick={onArchiveToggle}
              className={`p-1.5 rounded-sm hover:bg-foreground/5 transition-colors ${
                archived ? "text-yellow-600" : "text-foreground/45"
              }`}
              aria-label={archived ? "Unarchive memory" : "Archive memory"}
            >
              <Archive size={16} fill={archived ? "currentColor" : "none"} strokeWidth={1.5} />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="p-1.5 rounded-sm hover:bg-red-500/10 text-foreground/45 hover:text-red-500 transition-colors ml-2"
              aria-label="Delete memory"
            >
              <Trash2 size={16} strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4 text-xs text-foreground/50 tracking-wide">
        <time dateTime={createdAt} className="select-none">
          {formattedDate}
        </time>

        {mode === "edit" ? (
          <div className="flex items-center gap-2 border-l border-border/60 pl-0 md:pl-4">
            <span className="text-[10px] text-foreground/35 uppercase select-none">Tags:</span>
            <input
              type="text"
              value={tags.map((t) => `#${t}`).join(", ")}
              onChange={handleTagsTextChange}
              className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 p-0 w-64 text-foreground/70 placeholder:text-foreground/20"
              placeholder="e.g. #personal, #milestone"
              aria-label="Tags (comma separated)"
            />
          </div>
        ) : (
          tags.length > 0 && (
            <div className="flex items-center gap-2 border-l border-border/60 pl-0 md:pl-4">
              <span className="text-[10px] text-foreground/35 uppercase select-none">Tags:</span>
              <div className="flex gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="bg-foreground/5 px-2 py-0.5 rounded-sm text-foreground/70 font-normal font-sans">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
