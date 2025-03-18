import React from "react";
import { cn } from "@/lib/utils";

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  numCols?: number;
  children?: React.ReactNode;
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, numCols = 12, children, ...props }, ref) => {
    return (
      <div
        className={cn("grid", {
          "grid-cols-1": numCols === 1,
          "grid-cols-2": numCols === 2,
          "grid-cols-3": numCols === 3,
          "grid-cols-4": numCols === 4,
          "grid-cols-5": numCols === 5,
          "grid-cols-6": numCols === 6,
          "grid-cols-7": numCols === 7,
          "grid-cols-8": numCols === 8,
          "grid-cols-9": numCols === 9,
          "grid-cols-10": numCols === 10,
          "grid-cols-11": numCols === 11,
          "grid-cols-12": numCols === 12,
          [className as string]: className,
        })}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = "Grid";

export { Grid };
