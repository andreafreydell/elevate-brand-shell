interface TagRedStampProps {
  className?: string;
  size?: number;
}

/** Brand signature tag-red square stamp. Place on every SVG infographic and dark panel. */
export const TagRedStamp = ({ className = "", size = 16 }: TagRedStampProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={`opacity-35 ${className}`}
    >
      <rect width="16" height="16" rx="3" fill="var(--tag-red)" />
    </svg>
  );
};
