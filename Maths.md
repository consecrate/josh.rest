I'll explore your project structure to understand how your blog is set up and recommend the best math rendering solution.

[4 tools called]

Let me also check a sample content file to see the current structure:

[1 tool called]

Now I have a complete picture. Your project uses **Astro 5.x with MDX**, and I can see you're already writing math content (derivatives!) using Unicode superscripts as a workaround. Here's the best approach for proper math rendering:

---

## Recommended Solution: **remark-math + rehype-katex**

This is the most well-integrated approach for Astro + MDX. It processes LaTeX syntax at build time, producing static HTML with no client-side JavaScript needed.

### Why This Stack?

| Approach                          | Pros                                                | Cons                      |
| --------------------------------- | --------------------------------------------------- | ------------------------- |
| **remark-math + rehype-katex** ✅ | Build-time rendering, zero JS, fast, standard LaTeX | Slightly larger CSS       |
| remark-math + rehype-mathjax      | More LaTeX coverage                                 | Heavier, slower builds    |
| Client-side KaTeX/MathJax         | Easy setup                                          | Requires JS, layout shift |

### How It Works

1. **remark-math** - Parses `$...$` (inline) and `$$...$$` (block) syntax in your MDX
2. **rehype-katex** - Converts the parsed math AST to beautiful HTML/CSS

### Installation

```bash
pnpm add remark-math rehype-katex
```

### Configuration

Update your `astro.config.mjs`:

```javascript
// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default defineConfig({
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      theme: "github-dark",
    },
  },
});
```

### Add KaTeX CSS

You need to include the KaTeX stylesheet. Add this to your base layout (likely in `src/layouts/`):

```astro
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
  integrity="sha384-nB0miv6/jRmo5YADAX1TQ0GR6tPbsLNjGJE/cAGCqsAv4FdL6wqpMJXSBxMz6CL4"
  crossorigin="anonymous"
/>
```

Or install locally for offline builds:

```bash
pnpm add katex
```

Then import in your layout:

```astro
---
import 'katex/dist/katex.min.css';
---
```

---

## Usage in Your MDX Files

Once configured, you can write proper LaTeX in your posts:

**Inline math** (use single `$`):

```mdx
The derivative is $\frac{d}{dx}[x^n] = nx^{n-1}$
```

**Block math** (use double `$$`):

```mdx
$$
\frac{d}{dx}[x^n] = nx^{n-1}
$$
```

### Your Updated Post Would Look Like:

```mdx
<ContentBlock title="The Power Rule">
One of the most fundamental rules in calculus is the **power rule**:

$$
\frac{d}{dx}[x^n] = nx^{n-1}
$$

In plain English: bring the exponent down as a coefficient, then reduce the exponent by one.

</ContentBlock>

<ContentBlock title="Example">
Let's find the derivative of $f(x) = x^3$:

1. Start with $x^3$
2. Bring the 3 down: $3x^3$
3. Reduce the exponent: $3x^2$

So the derivative of $x^3$ is $\boxed{3x^2}$.

</ContentBlock>
```

---

## Key Considerations

1. **Escaping in MDX**: If you need a literal `$`, use `\$`

2. **Conflict with JSX**: Inside JSX props, you may need to escape braces:

   ```jsx
   explanation = "Using the power rule: $\frac{d}{dx}[x^2] = 2x$";
   ```

3. **Performance**: KaTeX renders at build time, so pages load fast with no layout shift

4. **Typography**: KaTeX handles fractions, integrals, matrices, etc.:
   ```latex
   $\int_0^1 x^2 \, dx = \frac{1}{3}$
   ```

---

## Summary

| Package        | Purpose                            |
| -------------- | ---------------------------------- |
| `remark-math`  | Parse `$...$` and `$$...$$` syntax |
| `rehype-katex` | Render LaTeX to HTML               |
| `katex` (CSS)  | Styling for rendered math          |

This approach is:

- ✅ Zero client-side JavaScript
- ✅ Fast build-time rendering
- ✅ Standard LaTeX syntax
- ✅ Works seamlessly with your existing MDX setup

Would you like me to switch to Agent mode and implement this for you?
