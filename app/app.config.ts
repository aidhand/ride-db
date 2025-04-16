export default defineAppConfig({
  ui: {
    container: {
      extend: {}, // Don't extend the themed container styles
      base: "mx-auto p-4 w-full max-w-(--ui-container)",
    },
  },
});
