import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { render } from './templates/company-fit/index.js';
import { SAMPLE_PAYLOAD } from './templates/company-fit/sample.js';

const FitDataSchema = z.object({
  verdict: z.enum(['good fit', 'borderline', 'not a fit']).optional()
    .describe("Fit verdict: 'good fit' | 'borderline' | 'not a fit'"),
  score: z.number().min(0).max(10).nullable().optional()
    .describe('Optional score 0–10'),
  rationale: z.string().optional()
    .describe('Plain-text rationale for the verdict. Supports **bold** markdown.'),
});

const AttributeItemSchema = z.object({
  attribute_name: z.string().optional(),
  attribute_description: z.string().optional()
    .describe('Supports **bold** markdown'),
});

const WhyNowItemSchema = z.object({
  title: z.string().optional(),
  date: z.string().optional().describe('ISO date YYYY-MM-DD'),
  abstract: z.string().optional().describe('One-line summary shown by default'),
  body: z.string().optional().describe('Long-form detail shown in expandable section'),
  url: z.string().optional().describe('Source URL — renders as a linked title'),
  importance: z.enum(['hot', 'warm', 'mild']).optional(),
});

const ContactSchema = z.object({
  name: z.string().optional(),
  name_initials: z.string().optional().describe('Override auto-generated initials'),
  email: z.string().optional(),
  phone: z.string().optional(),
  linkedin: z.string().optional().describe('Full LinkedIn profile URL'),
  role: z.string().optional(),
  best_angle: z.string().optional().describe('Recommended outreach angle'),
});

const ActivitySchema = z.object({
  date: z.string().optional().describe('ISO date YYYY-MM-DD'),
  summary: z.string().optional(),
  detail: z.string().optional().describe('Long-form detail — renders in expandable row'),
});

const FreetextItemSchema = z.object({
  heading: z.string().optional(),
  body: z.string().optional().describe('Supports **bold** markdown and double-newline paragraphs'),
});

const NotesPayloadSchema = z.object({
  fit: FitDataSchema.optional(),
  freetext_after_fit: z.array(FreetextItemSchema).optional(),
  why_it_fits: z.array(AttributeItemSchema).optional()
    .describe('Up to 5 horizontal-scroll attribute cards'),
  fit_gaps: z.array(AttributeItemSchema).optional()
    .describe('Same card format as why_it_fits, colour-coded by verdict'),
  freetext_after_why_it_fits: z.array(FreetextItemSchema).optional(),
  why_now: z.array(WhyNowItemSchema).optional()
    .describe('Signal cards with hot/warm/mild heat indicators'),
  freetext_after_why_now: z.array(FreetextItemSchema).optional(),
  who_to_reach_out_to: z.array(ContactSchema).optional()
    .describe('Contact cards with expandable detail rows'),
  last_activities: z.array(ActivitySchema).optional()
    .describe('Timeline rows sorted by date desc, first 4 visible'),
  freetext_after_contacts: z.array(FreetextItemSchema).optional(),
  freetext_before_next_steps: z.array(FreetextItemSchema).optional(),
  next_steps: z.record(z.string(), z.string()).optional()
    .describe('Numbered action map e.g. { "1": "Draft outreach...", "2": "..." }'),
});

export function createServer(): McpServer {
  const server = new McpServer({ name: 'gokit', version: '1.0.0' });

  server.tool(
    'render_company_profile',
    [
      'Render a Goava company-fit analysis as a self-contained interactive HTML card.',
      'The card includes: fit verdict + score, why-it-fits attributes (horizontal scroll),',
      'fit gaps, market signals with heat indicators (hot/warm/mild), key contacts with',
      'expandable details, activity timeline, and recommended next steps.',
      'Returns raw HTML — present it as an HTML artifact so the user can see the visual card.',
    ].join(' '),
    { payload: NotesPayloadSchema },
    async ({ payload }) => ({
      content: [{ type: 'text' as const, text: render(payload) }],
    }),
  );

  server.tool(
    'get_sample_company_fit',
    [
      'Return a fully rendered company-fit card using the built-in ROCKWOOL A/S sample data.',
      'Use this to demonstrate the card format without requiring any input.',
      'Returns raw HTML — present it as an HTML artifact so the user can see the visual card.',
    ].join(' '),
    {},
    async () => ({
      content: [{ type: 'text' as const, text: render(SAMPLE_PAYLOAD) }],
    }),
  );

  server.registerPrompt(
    'company_fit_wizard',
    {
      title: 'Company Fit Wizard',
      description: 'Build a company-fit card interactively — Claude will ask you questions section by section and render the final card.',
      argsSchema: {
        company_name: z.string().optional().describe('Company to analyze (optional — will ask if omitted)'),
      },
    },
    ({ company_name }) => ({
      messages: [
        {
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: [
              company_name
                ? `I want to create a company-fit analysis card for **${company_name}**.`
                : `I want to create a company-fit analysis card.`,
              '',
              'Please guide me through this one section at a time. Ask each section as a separate question, wait for my answer, then move on. Sections:',
              '',
              '1. **Fit verdict** — good fit / borderline / not a fit? Score 0–10? One-sentence rationale?',
              '2. **Why it fits** — up to 5 attribute cards (short name + description each)',
              '3. **Fit gaps** — any concerns or missing criteria?',
              '4. **Why now** — market signals or triggers (title, date, short summary, hot/warm/mild importance)',
              '5. **Key contacts** — who to reach out to (name, role, email, best outreach angle)',
              '6. **Recent activities** — any past interactions or events (date + summary)',
              '7. **Next steps** — numbered recommended actions',
              '',
              'Once you have all the answers, call `render_company_profile` with the complete payload and show me the card.',
            ].join('\n'),
          },
        },
      ],
    }),
  );

  return server;
}
