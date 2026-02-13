import { ApiReference } from "@scalar/nextjs-api-reference";

export const GET = ApiReference({
  url: "/api/swagger",
  agent: {
    disabled: true,
  },
  telemetry: false,
  showDeveloperTools: "never",
  customCss: `.scalar-app footer { display: none; }`,
});
