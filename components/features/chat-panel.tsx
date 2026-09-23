"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { DocumentSearch } from '@/lib/search';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { ParsedDocument } from '@/lib/parser';
import { getChatHistory, saveChatHistory, ChatMessage } from '@/lib/db';
import { useProfile } from '@/hooks/use-profile';
import { MessageSquare, Send, Loader2, Info } from 'lucide-react';
import { useI18n } from '@/components/providers/i18n-provider';

interface ChatPanelProps {
  document: ParsedDocument;
  onClauseClick?: (clauseId: string) => void;
}

export function ChatPanel({ document, onClauseClick }: ChatPanelProps) {
  const { profile } = useProfile();
  const { tr } = useI18n();
  const searcher = useMemo(() => new DocumentSearch(document), [document]);
  const [isReady, setIsReady] = useState(false);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getChatHistory(document.id).then((history) => {
      if (history && history.length > 0) {
        setMessages(history);
      }
      setIsReady(true);
    });
  }, [document.id]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input, createdAt: Date.now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const contextClauses = searcher.retrieve(userMsg.content, 5);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          contextClauses: contextClauses.map(c => ({ id: c.id, heading: c.sectionIndex.toString(), normalizedText: c.normalizedText })),
          role: profile?.role,
          goal: profile?.goal,
          language: profile?.outputLanguage,
        })
      });

      if (!res.ok || !res.body) throw new Error('Network error');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      const assistantMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: '', createdAt: Date.now() };
      
      setMessages([...newMessages, assistantMsg]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        assistantMsg.content += chunk;
        setMessages([...newMessages, { ...assistantMsg }]);
      }

      if (!assistantMsg.content.trim()) throw new Error('Empty response from model');
      saveChatHistory(document.id, [...newMessages, assistantMsg]);
    } catch (err) {
      console.error(err);
      // Show the failure in the thread instead of silently dropping the question
      setMessages([...newMessages, { id: (Date.now() + 2).toString(), role: 'assistant', content: tr.ask.error, createdAt: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to parse [S1.2] citations into clickable pills
  const renderMessageContent = (content: string) => {
    const parts = content.split(/(\[[S\d.]+\])/g);
    return parts.map((part, i) => {
      const match = part.match(/\[(S[\d.]+)\]/);
      if (match) {
        const clauseId = match[1];
        return (
          <button
            key={i}
            onClick={() => onClauseClick?.(clauseId)}
            className="inline-flex items-center px-1.5 py-0.5 mx-1 text-xs font-medium bg-primary/10 text-primary rounded border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer"
            title={tr.ask.jumpToClause}
          >
            {clauseId}
          </button>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  if (!isReady) return <div className="p-4 flex items-center justify-center text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin" /></div>;

  return (
    <div className="flex flex-col h-full bg-paper dark:bg-paper-dark border-l border-border/50">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-paper-texture">
        <MessageSquare className="w-4 h-4 text-primary" />
        <h3 className="font-medium text-sm">{tr.ask.header}</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-60">
            <Info className="w-8 h-8" />
            <p className="text-sm whitespace-pre-line">{tr.ask.emptyState}</p>
          </div>
        )}

        {messages.map((m: ChatMessage) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg px-4 py-3 text-sm ${
              m.role === 'user' 
                ? 'bg-primary text-primary-foreground rounded-br-sm' 
                : 'bg-muted border border-border/50 rounded-bl-sm shadow-sm'
            }`}>
              {m.role === 'assistant' ? renderMessageContent(m.content) : m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-muted border border-border/50 rounded-lg px-4 py-3 text-sm rounded-bl-sm">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
             </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-border/50 bg-paper-texture">
        <form onSubmit={onSubmit} className="relative flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={tr.ask.placeholder}
            className="min-h-[44px] max-h-32 resize-none rounded-lg pr-12 focus-visible:ring-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const event = new Event('submit', { cancelable: true, bubbles: true });
                e.currentTarget.form?.dispatchEvent(event);
              }
            }}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!input.trim() || isLoading}
            className="absolute right-2 bottom-2 w-7 h-7 rounded-md"
            aria-label={tr.ask.send}
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
