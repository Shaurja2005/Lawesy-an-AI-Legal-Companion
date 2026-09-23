"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDocumentLibrary } from '@/hooks/use-document-library';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, GitCompare, Loader2 } from 'lucide-react';
import { useI18n } from '@/components/providers/i18n-provider';

interface CompareModalProps {
  currentDocId: string;
  trigger?: React.ReactNode;
}

export function CompareModal({ currentDocId, trigger }: CompareModalProps) {
  const router = useRouter();
  const { tr } = useI18n();
  const { documents, loading } = useDocumentLibrary();
  const [open, setOpen] = useState(false);
  const [navigating, setNavigating] = useState(false);

  const otherDocs = documents.filter(d => d.id !== currentDocId);

  const handleCompare = (targetDocId: string) => {
    setNavigating(true);
    router.push(`/compare/${currentDocId}/${targetDocId}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="secondary" size="sm" className="gap-2">
            <GitCompare className="w-4 h-4" /> {tr.workspace.compareButton}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-paper text-ink border-border/50">
        <DialogHeader>
          <DialogTitle className="font-heading font-semibold text-xl">{tr.compare.selectDocument}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-2 max-h-[300px] overflow-y-auto">
          {loading ? (
            <div className="py-8 flex justify-center text-ink-muted">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : otherDocs.length === 0 ? (
            <div className="py-8 text-center text-ink-muted text-sm border border-dashed border-border/50 rounded-lg">
              {tr.compare.noOtherDocs}<br />{tr.compare.uploadAnother}
            </div>
          ) : (
            otherDocs.map(doc => (
              <button
                key={doc.id}
                onClick={() => handleCompare(doc.id)}
                disabled={navigating}
                className="w-full text-left flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-accent/5 transition-colors disabled:opacity-50"
              >
                <div className="bg-primary/10 p-2 rounded text-primary">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-ui text-sm font-medium truncate">{doc.filename ?? tr.common.untitled}</p>
                  <p className="text-xs text-ink-muted">{new Date(doc.createdAt).toLocaleDateString()}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
