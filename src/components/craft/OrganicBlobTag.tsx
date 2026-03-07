import { type ReactNode } from "react";

interface OrganicBlobTagProps {
  children: ReactNode;
  variant?: "coastal" | "statement" | "modern" | "classic";
  className?: string;
}

const BLOB_PATHS: Record<string, { path: string; fill: string; opacity: number }> = {
  coastal: {
    path: "M20,35 C20,15 45,5 100,8 C155,11 180,20 185,35 C190,50 160,62 100,60 C40,58 20,55 20,35Z",
    fill: "var(--seafoam)",
    opacity: 0.3,
  },
  statement: {
    path: "M15,32 C18,12 50,5 105,10 C160,15 188,22 185,38 C182,54 155,65 95,62 C35,59 12,52 15,32Z",
    fill: "var(--blush-peach)",
    opacity: 0.3,
  },
  modern: {
    path: "M22,30 C25,10 55,2 100,6 C145,10 178,18 182,36 C186,54 150,66 100,64 C50,62 19,50 22,30Z",
    fill: "var(--sky)",
    opacity: 0.25,
  },
  classic: {
    path: "M18,38 C15,18 48,6 100,9 C152,12 185,20 183,40 C181,60 148,68 96,65 C44,62 21,58 18,38Z",
    fill: "var(--brass)",
    opacity: 0.25,
  },
};

/** Irregular pooling shape behind labels. Use on product cards and editorial category labels. */
export const OrganicBlobTag = ({
  children,
  variant = "coastal",
  className = "",
}: OrganicBlobTagProps) => {
  const blob = BLOB_PATHS[variant];

  return (
    <div className={`relative inline-flex items-center justify-center px-5 py-2 ${className}`}>
      <svg
        viewBox="0 0 200 70"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <path d={blob.path} fill={blob.fill} opacity={blob.opacity} />
      </svg>
      <span className="relative z-10 font-sans text-[9px] font-medium tracking-[0.15em] uppercase text-ink">
        {children}
      </span>
    </div>
  );
};
