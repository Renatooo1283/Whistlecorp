import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  hover?: boolean;
};

export function Card({ className, hover = false, ...rest }: Props) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm",
        hover &&
          "transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06]",
        className
      )}
      {...rest}
    />
  );
}
