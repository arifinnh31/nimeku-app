import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  href?: string;
}

export function SectionHeader({ title, href }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="font-[var(--font-heading)] text-xl md:text-2xl font-bold">
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
        >
          Lihat Semua
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
