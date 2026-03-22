import { useEffect } from "react";

type PageMetadata = {
  title: string;
  description: string;
};

const ensureMetaTag = (name: string) => {
  let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }

  return tag;
};

export const usePageMetadata = ({ title, description }: PageMetadata) => {
  useEffect(() => {
    document.title = title;
    ensureMetaTag("description").setAttribute("content", description);
  }, [description, title]);
};
