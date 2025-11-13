export const STYLE_CONSTANTS = {
  SPACING: {
    XS: "space-y-2",
    SM: "space-y-4",
    MD: "space-y-6",
    LG: "space-y-8",
    XL: "space-y-12",
  },
  PADDING: {
    XS: "p-2",
    SM: "p-4",
    MD: "p-6",
    LG: "p-8",
    XL: "p-12",
  },
  CONTAINER: {
    DEFAULT: "container mx-auto px-4",
    NARROW: "container mx-auto px-4 max-w-2xl",
    WIDE: "container mx-auto px-4 max-w-7xl",
  },
  GRID: {
    DEFAULT: "grid gap-4",
    COLS_2: "grid grid-cols-1 md:grid-cols-2 gap-4",
    COLS_3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
    COLS_4: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
  },
  CARD: {
    DEFAULT: "rounded-lg border bg-card text-card-foreground shadow-sm",
    HOVER: "rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow",
  },
  FORM: {
    GROUP: "space-y-2",
    LABEL: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    INPUT: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  },
} as const