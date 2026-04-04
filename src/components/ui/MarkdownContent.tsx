"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  content: string | null | undefined;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  if (!content) return null;
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-semibold prose-table:text-sm prose-th:bg-muted prose-th:p-2 prose-td:p-2">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
