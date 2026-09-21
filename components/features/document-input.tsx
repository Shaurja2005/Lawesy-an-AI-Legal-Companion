'use client';

import { useRef, useState, useCallback, DragEvent, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE_BYTES,
  isAcceptedFileType,
  isFileSizeOk,
} from '@/lib/upload';
import { UploadCloud, FileText, X } from 'lucide-react';

export interface DocumentInputProps {
  onSubmit: (text: string, filename?: string) => void;
  isLoading?: boolean;
}

export function DocumentInput({ onSubmit, isLoading }: DocumentInputProps) {
  const [tab, setTab] = useState<'upload' | 'paste'>('upload');
  const [pasteText, setPasteText] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadSample = useCallback(async (path: string, name: string) => {
    try {
      setError(null);
      const res = await fetch(path);
      if (!res.ok) throw new Error('Failed to load sample');
      const text = await res.text();
      onSubmit(text, name);
    } catch (err) {
      setError('Could not load sample document.');
    }
  }, [onSubmit]);

  const validateFile = useCallback((file: File): string | null => {
    if (!isAcceptedFileType(file.type)) return 'Unsupported file type. Please use PDF, DOCX, or plain text.';
    if (!isFileSizeOk(file.size)) return 'File is too large. Maximum size is 20 MB.';
    return null;
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    const err = validateFile(file);
    if (err) { setError(err); return; }
    setError(null);
    setSelectedFile(file);
  }, [validateFile]);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleSubmit = useCallback(async () => {
    setError(null);
    if (tab === 'paste') {
      if (!pasteText.trim()) { setError('Please paste some text.'); return; }
      onSubmit(pasteText.trim());
    } else {
      if (!selectedFile) { setError('Please select a file.'); return; }
      // For plain text files, read directly; PDF handled server-side
      if (selectedFile.type === 'text/plain') {
        const text = await selectedFile.text();
        onSubmit(text, selectedFile.name);
      } else {
        // Binary files go to server — send the File object as form data
        const form = new FormData();
        form.append('file', selectedFile);
        // Caller handles via dedicated API route; we pass filename as signal
        onSubmit(`__FILE__:${selectedFile.name}`, selectedFile.name);
      }
    }
  }, [tab, pasteText, selectedFile, onSubmit]);

  return (
    <div className="flex flex-col gap-4 max-w-2xl w-full mx-auto">
      {/* Tabs */}
      <div className="flex gap-2" role="tablist" aria-label="Input method">
        {(['upload', 'paste'] as const).map(t => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn(
              'px-4 py-1.5 rounded-t-[4px] text-sm font-ui transition-colors border border-transparent',
              tab === t
                ? 'bg-paper text-ink border-paper-line border-b-0 shadow-sm'
                : 'text-ink-muted hover:text-ink bg-paper-alt'
            )}
          >
            {t === 'upload' ? 'Upload file' : 'Paste text'}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="bg-paper rounded-[2px] shadow-[var(--shadow-sheet)] p-4">
        {tab === 'upload' ? (
          <div>
            {/* Drop zone */}
            <div
              role="button"
              tabIndex={0}
              aria-label="Drop zone: click or drag a file here"
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
              className={cn(
                'flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-[4px] p-10 cursor-pointer transition-colors text-center',
                dragOver
                  ? 'border-accent bg-accent/5'
                  : 'border-paper-line hover:border-ink-muted'
              )}
            >
              <UploadCloud className="w-10 h-10 text-ink-muted" aria-hidden="true" />
              <div className="text-sm text-ink-muted">
                <span className="font-medium text-ink">Click to upload</span> or drag & drop
              </div>
              <p className="text-xs text-ink-faint">PDF, DOCX, or TXT · Max 20 MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_FILE_TYPES.join(',')}
              onChange={handleInputChange}
              className="sr-only"
              aria-label="File input"
            />

            {/* Selected file badge */}
            {selectedFile && (
              <div className="mt-3 flex items-center gap-2 bg-paper-alt rounded-[4px] px-3 py-2 text-sm text-ink">
                <FileText className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
                <span className="flex-1 truncate">{selectedFile.name}</span>
                <button
                  onClick={e => { e.stopPropagation(); setSelectedFile(null); }}
                  aria-label="Remove selected file"
                  className="text-ink-muted hover:text-ink"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            
            {/* Samples */}
            {!selectedFile && (
              <div className="mt-4 pt-4 border-t border-paper-line">
                <p className="text-xs font-semibold text-ink-muted mb-2 uppercase tracking-wider">Or try a sample</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm" onClick={() => loadSample('/samples/lease.txt', 'Sample Lease Agreement.txt')} type="button">Lease Agreement</Button>
                  <Button variant="secondary" size="sm" onClick={() => loadSample('/samples/offer.txt', 'Sample Offer Letter.txt')} type="button">Offer Letter</Button>
                  <Button variant="secondary" size="sm" onClick={() => loadSample('/samples/tos.txt', 'Sample Terms of Service.txt')} type="button">Terms of Service</Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Textarea
            placeholder="Paste the text of your legal document here…"
            value={pasteText}
            onChange={e => setPasteText(e.target.value)}
            className="min-h-[200px] font-body text-base leading-relaxed"
            aria-label="Document text"
          />
        )}

        {/* Error */}
        {error && (
          <p role="alert" className="mt-2 text-sm text-risk-high font-ui">
            {error}
          </p>
        )}

        <Button
          className="mt-4 w-full"
          onClick={handleSubmit}
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? 'Processing…' : 'Analyse document →'}
        </Button>
      </div>
    </div>
  );
}
