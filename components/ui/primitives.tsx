import clsx from "clsx";
import Link from "next/link";

export function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("rounded-lg border border-line bg-paper", className)}>
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
      <div>
        {eyebrow && <p className="text-sm text-ink-soft mb-1">{eyebrow}</p>}
        <h1 className="font-display text-2xl md:text-[28px] font-semibold text-ink tracking-tight">
          {title}
        </h1>
        {description && <p className="text-ink-soft mt-1.5 max-w-xl text-sm leading-relaxed">{description}</p>}
      </div>
      {action}
    </div>
  );
}

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors disabled:opacity-40 disabled:pointer-events-none";

const buttonVariants = {
  primary: "bg-graphite text-white hover:bg-graphite-2 px-4 py-2",
  secondary: "bg-transparent border border-line text-ink hover:border-graphite px-4 py-2",
  ghost: "bg-transparent text-ink-soft hover:text-ink px-2 py-1",
  danger: "bg-block text-white hover:opacity-90 px-4 py-2",
};

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof buttonVariants;
}) {
  return (
    <button className={clsx(buttonBase, buttonVariants[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof buttonVariants;
  className?: string;
}) {
  return (
    <Link href={href} className={clsx(buttonBase, buttonVariants[variant], className)}>
      {children}
    </Link>
  );
}

const paletteFrom = (seed: string) => {
  const palettes = [
    ["#E8A33D", "#1B2430"],
    ["#3F8F6F", "#1B2430"],
    ["#5B7FBF", "#1B2430"],
    ["#C4453B", "#ffffff"],
    ["#8A6FBF", "#ffffff"],
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return palettes[hash % palettes.length];
};

export function Avatar({ seed, name, size = 36 }: { seed: string; name: string; size?: number }) {
  const [bg, fg] = paletteFrom(seed);
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className="flex items-center justify-center rounded-md font-display font-semibold shrink-0"
      style={{ background: bg, color: fg, width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials}
    </div>
  );
}

export function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-lg border border-dashed border-line py-14 text-center">
      <p className="font-display text-ink font-medium">{title}</p>
      <p className="text-ink-soft text-sm mt-1 max-w-sm mx-auto">{detail}</p>
    </div>
  );
}
