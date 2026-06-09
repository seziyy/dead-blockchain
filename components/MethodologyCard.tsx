import { CheckCircle2 } from "lucide-react";

export function MethodologyCard({
  title,
  copy,
  items
}: {
  title: string;
  copy: string;
  items?: string[];
}) {
  return (
    <article className="glass p-5">
      <h2 className="border-b-[3px] border-app-line pb-3 text-xl font-black uppercase text-app-text">{title}</h2>
      <p className="mt-3 leading-7 text-app-muted">{copy}</p>
      {items ? (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item} className="flex gap-3 text-sm text-app-muted">
              <CheckCircle2 className="mt-0.5 shrink-0 text-app-text" size={16} strokeWidth={2.5} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
