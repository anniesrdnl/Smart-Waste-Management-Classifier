interface SectionHeadingProps {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
}

/** Title on the left and description on the right on wide screens, stacked on small ones. */
export default function SectionHeading({ id, eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold tracking-wide text-brand-700 uppercase">{eyebrow}</p>
        <h2 id={id} className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-[2.125rem]">
          {title}
        </h2>
      </div>
      {description && (
        <p className="max-w-xl text-base leading-relaxed text-ink-muted lg:max-w-md lg:pb-1">{description}</p>
      )}
    </div>
  );
}
