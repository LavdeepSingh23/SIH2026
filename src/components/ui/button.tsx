import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { buttonVariants, liquidbuttonVariants } from "./buttonVariants";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

function LiquidButton({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof liquidbuttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <>
      <Comp
        data-slot="button"
        className={cn(
          "relative",
          liquidbuttonVariants({ variant, size, className })
        )}
        {...props}
      >
        <div
          className="absolute top-0 left-0 z-0 h-full w-full rounded-xl 
            shadow-[0_0_8px_rgba(0,0,0,0.4),0_2px_6px_rgba(0,0,0,0.6),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.2),inset_-3px_-3px_0.5px_-3.5px_rgba(0,240,255,0.4),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.4),inset_-1px_-1px_1px_-0.5px_rgba(0,240,255,0.3),inset_0_0_6px_6px_rgba(0,240,255,0.08),0_0_16px_rgba(0,240,255,0.25)] 
            transition-all bg-white/[0.04] backdrop-blur-md border border-white/10"
        />
        <div
          className="absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-xl"
          style={{ backdropFilter: 'url("#container-glass")' }}
        />

        <div className="pointer-events-none z-10 flex items-center gap-2">
          {children}
        </div>
        <GlassFilter />
      </Comp>
    </>
  );
}

function GlassFilter() {
  return (
    <svg className="hidden">
      <defs>
        <filter
          id="container-glass"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.05"
            numOctaves="1"
            seed="1"
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="70"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

type ColorVariant =
  | "default"
  | "primary"
  | "cyan"
  | "success"
  | "error"
  | "gold"
  | "bronze";

interface MetalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ColorVariant;
}

const colorVariants: Record<
  ColorVariant,
  {
    outer: string;
    inner: string;
    button: string;
    textColor: string;
    textShadow: string;
  }
> = {
  default: {
    outer: "bg-gradient-to-b from-[#1a2230] to-[#05080e]",
    inner: "bg-gradient-to-b from-[#2a374a] via-[#101722] to-[#1c2635]",
    button: "bg-gradient-to-b from-[#182333] to-[#0c131c]",
    textColor: "text-white",
    textShadow: "[text-shadow:_0_-1px_0_rgb(0_0_0_/_100%)]",
  },
  primary: {
    outer: "bg-gradient-to-b from-[#00f0ff] to-[#004455]",
    inner: "bg-gradient-to-b from-[#70f8ff] via-[#008ba3] to-[#005566]",
    button: "bg-gradient-to-b from-[#00d8e6] to-[#008899]",
    textColor: "text-[#020912]",
    textShadow: "[text-shadow:_0_1px_0_rgba(255_255_255_/_40%)]",
  },
  cyan: {
    outer: "bg-gradient-to-b from-[#00f0ff] to-[#052433]",
    inner: "bg-gradient-to-b from-[#5cf5ff] via-[#008ca1] to-[#032e3d]",
    button: "bg-gradient-to-b from-[#00d5e5] to-[#007b8c]",
    textColor: "text-[#001017]",
    textShadow: "[text-shadow:_0_1px_0_rgba(255_255_255_/_40%)]",
  },
  success: {
    outer: "bg-gradient-to-b from-[#005A43] to-[#7CCB9B]",
    inner: "bg-gradient-to-b from-[#E5F8F0] via-[#00352F] to-[#D1F0E6]",
    button: "bg-gradient-to-b from-[#9ADBC8] to-[#3E8F7C]",
    textColor: "text-[#FFF7F0]",
    textShadow: "[text-shadow:_0_-1px_0_rgb(6_78_59_/_100%)]",
  },
  error: {
    outer: "bg-gradient-to-b from-[#5A0000] to-[#FFAEB0]",
    inner: "bg-gradient-to-b from-[#FFDEDE] via-[#680002] to-[#FFE9E9]",
    button: "bg-gradient-to-b from-[#F08D8F] to-[#A45253]",
    textColor: "text-[#FFF7F0]",
    textShadow: "[text-shadow:_0_-1px_0_rgb(146_64_14_/_100%)]",
  },
  gold: {
    outer: "bg-gradient-to-b from-[#917100] to-[#EAD98F]",
    inner: "bg-gradient-to-b from-[#FFFDDD] via-[#856807] to-[#FFF1B3]",
    button: "bg-gradient-to-b from-[#FFEBA1] to-[#9B873F]",
    textColor: "text-[#FFFDE5]",
    textShadow: "[text-shadow:_0_-1px_0_rgb(178_140_2_/_100%)]",
  },
  bronze: {
    outer: "bg-gradient-to-b from-[#864813] to-[#E9B486]",
    inner: "bg-gradient-to-b from-[#EDC5A1] via-[#5F2D01] to-[#FFDEC1]",
    button: "bg-gradient-to-b from-[#FFE3C9] to-[#A36F3D]",
    textColor: "text-[#FFF7F0]",
    textShadow: "[text-shadow:_0_-1px_0_rgb(124_45_18_/_100%)]",
  },
};

const metalButtonVariants = (
  variant: ColorVariant = "default",
  isPressed: boolean,
  isHovered: boolean,
  isTouchDevice: boolean
) => {
  const colors = colorVariants[variant];
  const transitionStyle = "all 250ms cubic-bezier(0.1, 0.4, 0.2, 1)";

  return {
    wrapper: cn(
      "relative inline-flex transform-gpu rounded-xl p-[1.25px] will-change-transform cursor-pointer select-none",
      colors.outer
    ),
    wrapperStyle: {
      transform: isPressed ? "translateY(2px) scale(0.99)" : "translateY(0) scale(1)",
      boxShadow: isPressed
        ? "0 1px 2px rgba(0, 0, 0, 0.4)"
        : isHovered && !isTouchDevice
        ? "0 6px 20px rgba(0, 240, 255, 0.25)"
        : "0 3px 12px rgba(0, 0, 0, 0.3)",
      transition: transitionStyle,
      transformOrigin: "center center",
    },
    inner: cn(
      "absolute inset-[1px] transform-gpu rounded-lg will-change-transform",
      colors.inner
    ),
    innerStyle: {
      transition: transitionStyle,
      transformOrigin: "center center",
      filter: isHovered && !isPressed && !isTouchDevice ? "brightness(1.08)" : "none",
    },
    button: cn(
      "relative z-10 m-[1px] rounded-lg inline-flex h-11 transform-gpu cursor-pointer items-center justify-center overflow-hidden px-6 py-2 text-sm leading-none font-bold will-change-transform outline-none gap-2",
      colors.button,
      colors.textColor,
      colors.textShadow
    ),
    buttonStyle: {
      transform: isPressed ? "scale(0.97)" : "scale(1)",
      transition: transitionStyle,
      transformOrigin: "center center",
      filter: isHovered && !isPressed && !isTouchDevice ? "brightness(1.03)" : "none",
    },
  };
};

const ShineEffect = ({ isPressed }: { isPressed: boolean }) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-20 overflow-hidden transition-opacity duration-300",
        isPressed ? "opacity-20" : "opacity-0"
      )}
    >
      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-transparent via-neutral-100 to-transparent" />
    </div>
  );
};

const MetalButton = React.forwardRef<HTMLButtonElement, MetalButtonProps>(
  ({ children, className, variant = "default", ...props }, ref) => {
    const [isPressed, setIsPressed] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);
    const [isTouchDevice] = React.useState(
      () => typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0)
    );

    const buttonText = children || "Button";
    const variants = metalButtonVariants(variant, isPressed, isHovered, isTouchDevice);

    return (
      <div className={variants.wrapper} style={variants.wrapperStyle}>
        <div className={variants.inner} style={variants.innerStyle}></div>
        <button
          ref={ref}
          className={cn(variants.button, className)}
          style={variants.buttonStyle}
          {...props}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => {
            setIsPressed(false);
            setIsHovered(false);
          }}
          onMouseEnter={() => {
            if (!isTouchDevice) setIsHovered(true);
          }}
          onTouchStart={() => setIsPressed(true)}
          onTouchEnd={() => setIsPressed(false)}
          onTouchCancel={() => setIsPressed(false)}
        >
          <ShineEffect isPressed={isPressed} />
          {buttonText}
          {isHovered && !isPressed && !isTouchDevice && (
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t rounded-lg from-transparent to-white/10" />
          )}
        </button>
      </div>
    );
  }
);
MetalButton.displayName = "MetalButton";

export { Button, LiquidButton, MetalButton };
