/// <reference path="../.astro/types.d.ts" />

declare module 'katex/contrib/auto-render' {
  interface RenderMathOptions {
    delimiters?: Array<{
      left: string;
      right: string;
      display: boolean;
    }>;
    throwOnError?: boolean;
    errorColor?: string;
    macros?: Record<string, string>;
  }

  export default function renderMathInElement(
    element: HTMLElement,
    options?: RenderMathOptions
  ): void;
}
