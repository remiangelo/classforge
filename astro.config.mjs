// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind({
      // @ts-ignore - applyBaseStyles is a valid option but not in the type definition
      applyBaseStyles: false, // We'll handle base styles in our CSS
    }),
  ],
  vite: {
    optimizeDeps: {
      include: ['@supabase/supabase-js'],
      exclude: ['@supabase/supabase-js/dist/module/'],
    },
    ssr: {
      noExternal: ['@supabase/supabase-js'],
    },
  },
});
