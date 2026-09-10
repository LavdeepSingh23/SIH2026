import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-teal text-[#000000] hover:bg-white hover:text-[#000000] shadow-[0_0_20px_rgba(0,240,255,0.35)]",
        destructive: "bg-red text-white hover:bg-red/90",
        cool: "bg-gradient-to-t border border-b-2 border-zinc-950/40 from-teal to-teal/85 shadow-md shadow-teal/20 ring-1 ring-inset ring-white/25 transition-[filter] duration-200 hover:brightness-110 active:brightness-90 text-[#000000]",
        outline: "border border-white/15 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 hover:border-teal/50 hover:text-teal",
        secondary: "bg-white/10 text-white hover:bg-white/15",
        ghost: "hover:bg-white/10 text-text-muted hover:text-white",
        link: "text-teal underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-7 text-base font-bold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export const liquidbuttonVariants = cva(
  "inline-flex items-center transition-colors justify-center cursor-pointer gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:scale-105 duration-300 transition text-white",
        cyan: "bg-transparent hover:scale-105 duration-300 transition text-teal",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline: "border border-white/20 bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-teal underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2 has-[>svg]:px-4",
        sm: "h-8 text-xs gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-11 rounded-xl px-6 has-[>svg]:px-5",
        xl: "h-12 rounded-xl px-8 has-[>svg]:px-6",
        xxl: "h-14 rounded-2xl px-10 has-[>svg]:px-8 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

