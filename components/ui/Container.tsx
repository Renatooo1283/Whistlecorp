import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement>;

export function Container({ className, ...rest }: Props) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8", className)}
      {...rest}
    />
  );
}
