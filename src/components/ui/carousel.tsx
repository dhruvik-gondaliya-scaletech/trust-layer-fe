"use client";

import * as React from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselContextProps = {
  activeIndex: number
  setActiveIndex: (index: number) => void
  totalSlides: number
  setTotalSlides: (count: number) => void
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
  orientation?: "horizontal" | "vertical"
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

export function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }
  return context
}

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ orientation = "horizontal", className, children, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState(0)
    const [totalSlides, setTotalSlides] = React.useState(0)

    const scrollPrev = React.useCallback(() => {
      setActiveIndex((prev) => Math.max(prev - 1, 0))
    }, [])

    const scrollNext = React.useCallback(() => {
      setActiveIndex((prev) => Math.min(prev + 1, totalSlides - 1))
    }, [totalSlides])

    const canScrollPrev = activeIndex > 0
    const canScrollNext = activeIndex < totalSlides - 1

    return (
      <CarouselContext.Provider
        value={{
          activeIndex,
          setActiveIndex,
          totalSlides,
          setTotalSlides,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
          orientation,
        }}
      >
        <div
          ref={ref}
          className={cn("relative w-full", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { activeIndex, setTotalSlides, orientation } = useCarousel()

  const childrenArray = React.Children.toArray(children)
  const count = childrenArray.length

  React.useEffect(() => {
    setTotalSlides(count)
  }, [count, setTotalSlides])

  return (
    <div ref={ref} className="overflow-hidden w-full h-full">
      <div
        className={cn(
          "flex h-full w-full transition-transform duration-300 ease-out",
          orientation === "vertical" ? "flex-col" : "flex-row",
          className
        )}
        style={{
          transform:
            orientation === "vertical"
              ? `translateY(-${activeIndex * 100}%)`
              : `translateX(-${activeIndex * 100}%)`,
        }}
        {...props}
      >
        {children}
      </div>
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full w-full h-full",
        className
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      ref={ref}
      type="button"
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full border border-border/80 bg-background/80 backdrop-blur-xs text-foreground/80 hover:text-foreground hover:bg-background shadow-md",
        "left-3 top-1/2 -translate-y-1/2",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      ref={ref}
      type="button"
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full border border-border/80 bg-background/80 backdrop-blur-xs text-foreground/80 hover:text-foreground hover:bg-background shadow-md",
        "right-3 top-1/2 -translate-y-1/2",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

const CarouselDots = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { activeIndex, totalSlides, setActiveIndex } = useCarousel()

  if (totalSlides <= 1) return null

  return (
    <div
      ref={ref}
      className={cn("flex justify-center gap-1.5 mt-2", className)}
      {...props}
    >
      {Array.from({ length: totalSlides }).map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => setActiveIndex(index)}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            index === activeIndex ? "w-4 bg-primary" : "w-1.5 bg-muted-foreground/35 hover:bg-muted-foreground/50"
          )}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  )
})
CarouselDots.displayName = "CarouselDots"

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
}
