import {
  emptyPluginConfigSchema,
  type OpenClawPluginApi,
  type ProviderAuthContext,
  type ProviderAuthResult,
} from "openclaw/plugin-sdk";

const PROVIDER_ID = "perplexity";
const PROVIDER_LABEL = "Perplexity";
const DEFAULT_BASE_URL = "https://api.perplexity.ai";
const DEFAULT_MODEL_IDS = ["sonar-pro"] as const;
const DEFAULT_CONTEXT_WINDOW = 128_000;
const DEFAULT_MAX_TOKENS = 8_192;

function normalizeBaseUrl(value?: string): string {
  const trimmed = value?.trim();
  const raw = trimmed && trimmed.length > 0 ? trimmed : DEFAULT_BASE_URL;
  const withProtocol = raw.startsWith("http") ? raw : `https://${raw}`;
  return withProtocol.replace(/\/+$/, "");
}

function validateBaseUrl(value: string): string | undefined {
  try {
    new URL(normalizeBaseUrl(value));
    return undefined;
  } catch {
    return "Enter a valid URL";
  }
}

function parseModelIds(input: string): string[] {
  const parsed = input
    .split(/[\n,]/)
    .map((model) => model.trim())
    .filter(Boolean);
  return Array.from(new Set(parsed));
}

function buildModelDefinition(modelId: string) {
  return {
    id: modelId,
    name: modelId,
    reasoning: false,
    input: ["text"] as Array<"text" | "image">,
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow: DEFAULT_CONTEXT_WINDOW,
    maxTokens: DEFAULT_MAX_TOKENS,
  };
}

async function promptForPerplexityAuth(ctx: ProviderAuthContext): Promise<ProviderAuthResult> {
  const apiKey = String(
    await ctx.prompter.text({
      message: "Perplexity API key",
      validate: (value) => (value?.trim() ? undefined : "API key is required"),
    }),
  ).trim();

  const baseUrlInput = await ctx.prompter.text({
    message: "Perplexity base URL",
    initialValue: DEFAULT_BASE_URL,
    validate: validateBaseUrl,
  });
  const baseUrl = normalizeBaseUrl(String(baseUrlInput));

  const modelInput = await ctx.prompter.text({
    message: "Model IDs (comma-separated)",
    initialValue: DEFAULT_MODEL_IDS.join(", "),
    validate: (value: string) =>
      parseModelIds(value).length > 0 ? undefined : "Enter at least one model id",
  });
  const modelIds = parseModelIds(String(modelInput));
  const defaultModelId = modelIds[0] ?? DEFAULT_MODEL_IDS[0];
  const defaultModelRef = `${PROVIDER_ID}/${defaultModelId}`;

  return {
    profiles: [
      {
        profileId: `${PROVIDER_ID}:api-key`,
        credential: {
          type: "api_key",
          provider: PROVIDER_ID,
          key: apiKey,
        },
      },
    ],
    configPatch: {
      models: {
        providers: {
          [PROVIDER_ID]: {
            baseUrl,
            apiKey,
            api: "openai-completions",
            models: modelIds.map((modelId) => buildModelDefinition(modelId)),
          },
        },
      },
      agents: {
        defaults: {
          models: Object.fromEntries(modelIds.map((modelId) => [`${PROVIDER_ID}/${modelId}`, {}])),
        },
      },
    },
    defaultModel: defaultModelRef,
    notes: [
      "Perplexity exposes an OpenAI-compatible chat/completions API at /chat/completions.",
      `Edit models.providers.${PROVIDER_ID}.models if you add or rename models in your Perplexity account.`,
    ],
  };
}

const perplexityPlugin = {
  id: "perplexity-provider",
  name: "Perplexity Provider",
  description: "Adds Perplexity API key auth and model definitions to OpenClaw.",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    api.registerProvider({
      id: PROVIDER_ID,
      label: PROVIDER_LABEL,
      docsPath: "/providers/perplexity",
      aliases: ["pplx"],
      envVars: ["PPLX_API_KEY", "PERPLEXITY_API_KEY"],
      auth: [
        {
          id: "api-key",
          label: "API key",
          hint: "Paste a Perplexity API key",
          kind: "api_key",
          run: async (ctx) => promptForPerplexityAuth(ctx),
        },
      ],
    });
  },
};

export default perplexityPlugin;
