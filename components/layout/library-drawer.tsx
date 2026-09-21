'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDocumentLibrary } from '@/hooks/use-document-library';
import { FileText, Trash2, LibraryBig } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function LibraryDrawer() {
  const { documents, loading, removeDocument } = useDocumentLibrary();
  const pathname = usePathname();
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Delete this document?')) {
      await removeDocument(id);
      if (pathname.includes(id)) {
        router.push('/desk');
      }
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden mt-6">
      <div className="flex items-center gap-2 px-3 mb-2 text-ink-muted text-xs font-semibold uppercase tracking-wider">
        <LibraryBig className="w-4 h-4" />
        <span>Your Library</span>
      </div>
      
      <div className="flex-1 overflow-y-auto px-2 space-y-1 pb-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="px-3 py-2">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))
        ) : documents.length === 0 ? (
          <div className="px-3 py-4 text-sm text-ink-faint text-center border border-dashed border-paper-line rounded-[4px] mx-1">
            No documents yet
          </div>
        ) : (
          documents.map(doc => {
            const active = pathname === `/desk/${doc.id}`;
            return (
              <Link
                key={doc.id}
                href={`/desk/${doc.id}`}
                className={cn(
                  'group flex items-start gap-3 p-2 rounded-[4px] transition-colors',
                  active
                    ? 'bg-paper shadow-sm border border-paper-line border-l-2 border-l-accent'
                    : 'hover:bg-paper-alt border border-transparent'
                )}
              >
                <FileText className={cn('w-4 h-4 mt-0.5 shrink-0', active ? 'text-accent' : 'text-ink-muted')} />
                <div className="flex-1 min-w-0">
                  <div className={cn('text-sm font-medium line-clamp-2 leading-tight', active ? 'text-ink' : 'text-ink-muted group-hover:text-ink')}>
                    {doc.filename ?? 'Untitled document'}
                  </div>
                  <div className="text-xs text-ink-faint mt-1 flex justify-between items-center">
                    <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => handleDelete(e, doc.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-ink-muted hover:text-risk-high rounded focus-visible:opacity-100 transition-opacity"
                  aria-label="Delete document"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
