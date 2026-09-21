import { Scale, ShieldCheck, Cpu, BookOpen, AlertTriangle } from 'lucide-react';
import { Paper } from '@/components/ui/paper';

export const metadata = {
  title: 'About Lawesy',
  description: 'How Lawesy works, its limitations, and a disclaimer about AI-generated legal analysis.',
};

const pillars = [
  {
    icon: ShieldCheck,
    title: 'Privacy by default',
    description:
      'Everything you paste or upload stays in your browser\'s local storage (IndexedDB). Nothing is sent to a server until you click "Analyse". No document text is ever logged or retained by Lawesy.',
  },
  {
    icon: Cpu,
    title: 'How the AI works',
    description:
      'Lawesy uses Google Gemini (Flash tier) to classify your document, extract key clauses, summarise the key points in plain language, and flag unusual or risky terms. The model is instructed to ground every answer strictly in the text you provide.',
  },
  {
    icon: BookOpen,
    title: 'What we analyse',
    description:
      'Tenancy agreements, employment contracts, NDAs, service agreements, purchase orders, and general contracts. The more structured the document, the better the analysis.',
  },
  {
    icon: AlertTriangle,
    title: 'Limitations',
    description:
      'AI can miss nuance, misread complex legalese, or give incomplete analysis for unusual clause structures. Always read the original document yourself, and consult a qualified lawyer for anything you plan to sign.',
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-10">
      <div className="flex items-center gap-4 mb-2">
        <Scale className="w-8 h-8 text-primary" />
        <h1 className="font-heading font-semibold text-3xl text-ink">About Lawesy</h1>
      </div>

      <p className="text-base text-ink-muted leading-relaxed font-ui">
        Lawesy is an AI legal companion that translates dense contracts into plain language, highlights hidden risks, and tells
        you what to watch out for — based on your role and situation. It is not a law firm and does not give legal advice.
      </p>

      <div className="space-y-4">
        {pillars.map(({ icon: Icon, title, description }) => (
          <Paper key={title} className="p-6 flex gap-5">
            <div className="shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div>
              <h2 className="font-heading font-semibold text-lg text-ink mb-1">{title}</h2>
              <p className="text-sm text-ink-muted leading-relaxed font-ui">{description}</p>
            </div>
          </Paper>
        ))}
      </div>

      <div className="border border-amber-300 bg-amber-50 rounded p-5 text-sm text-amber-900 leading-relaxed">
        <strong className="font-semibold">Legal Disclaimer:</strong> Lawesy provides AI-generated information to help you
        understand documents. This is not legal advice. For any document with serious financial, legal, or personal
        consequences — including anything you intend to sign — please consult a qualified solicitor or lawyer in your
        jurisdiction.
      </div>
    </div>
  );
}
