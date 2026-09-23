'use client';

import { useI18n } from '@/components/providers/i18n-provider';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n';
import { Paper } from '@/components/ui/paper';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useTheme } from 'next-themes';
import { useProfile } from '@/hooks/use-profile';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Globe, Palette, User, ShieldCheck, Trash2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { OutputLanguage } from '@/lib/schemas/ai';

export default function SettingsPage() {
  const { tr, lang, setLang } = useI18n();
  const { theme, setTheme } = useTheme();
  const { profile, saveProfile, loading } = useProfile();
  const [saving, setSaving] = useState(false);
  const [clearConfirm, setClearConfirm] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-ink-muted" />
      </div>
    );
  }

  const handleLangChange = async (value: string) => {
    setSaving(true);
    await setLang(value as OutputLanguage);
    setSaving(false);
  };

  const handleRedactToggle = async (checked: boolean) => {
    await saveProfile({ redactPII: checked });
  };

  const handleClearData = async () => {
    if (!clearConfirm) {
      setClearConfirm(true);
      return;
    }
    try {
      const { clearAllData } = await import('@/lib/db');
      await clearAllData();
      window.location.href = '/';
    } catch {
      setClearConfirm(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <h1 className="font-heading font-semibold text-3xl text-ink">{tr.settings.title}</h1>

      {/* ── Language ──────────────────────────────────────── */}
      <Paper className="p-6 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-5 h-5 text-primary" />
          <h2 className="font-heading font-semibold text-lg text-ink">{tr.settings.languageSection}</h2>
        </div>
        <div>
          <label className="block text-sm font-semibold text-ink mb-1">{tr.onboarding.languageLabel}</label>
          <Select value={lang} onValueChange={handleLangChange} disabled={saving}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map(l => (
                <SelectItem key={l.code} value={l.code}>
                  {l.nativeLabel !== l.label ? `${l.nativeLabel} — ${l.label}` : l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-ink-muted mt-1">{tr.settings.languageHelp}</p>
        </div>
      </Paper>

      {/* ── Appearance ────────────────────────────────────── */}
      <Paper className="p-6 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="w-5 h-5 text-primary" />
          <h2 className="font-heading font-semibold text-lg text-ink">{tr.settings.appearanceSection}</h2>
        </div>
        <div>
          <label className="block text-sm font-semibold text-ink mb-1">{tr.settings.themeLabel}</label>
          <Select value={theme ?? 'system'} onValueChange={setTheme}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">{tr.settings.themeLight}</SelectItem>
              <SelectItem value="dark">{tr.settings.themeDark}</SelectItem>
              <SelectItem value="system">{tr.settings.themeSystem}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Paper>

      {/* ── Profile ───────────────────────────────────────── */}
      <Paper className="p-6 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-5 h-5 text-primary" />
          <h2 className="font-heading font-semibold text-lg text-ink">{tr.settings.profileSection}</h2>
        </div>
        <p className="text-sm text-ink-muted">
          {tr.settings.viewingAs} <strong className="text-ink">{tr.roles[profile.role] ?? profile.role}</strong>
          {profile.jurisdiction.country && <> · <strong className="text-ink">{profile.jurisdiction.country}</strong></>}
          {profile.jurisdiction.region && <>, {profile.jurisdiction.region}</>}
          {' · '}<strong className="text-ink">{tr.expertise[profile.expertise] ?? profile.expertise}</strong>
        </p>
        <a href="/onboarding" className="text-sm text-primary hover:underline underline-offset-2">
          {tr.settings.editProfile}
        </a>
      </Paper>

      {/* ── Privacy ───────────────────────────────────────── */}
      <Paper className="p-6 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <h2 className="font-heading font-semibold text-lg text-ink">{tr.settings.privacySection}</h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-semibold text-ink">{tr.onboarding.redactLabel}</label>
            <p className="text-xs text-ink-muted">{tr.onboarding.redactDescription}</p>
          </div>
          <Switch checked={profile.redactPII} onCheckedChange={handleRedactToggle} />
        </div>

        <div className="border-t border-paper-line pt-4">
          <label className="block text-sm font-semibold text-ink mb-1">{tr.settings.clearDataLabel}</label>
          <p className="text-xs text-ink-muted mb-3">{tr.settings.clearDataDescription}</p>
          <Button
            variant={clearConfirm ? 'danger' : 'secondary'}
            size="sm"
            onClick={handleClearData}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {clearConfirm ? tr.settings.confirmClear : tr.settings.clearDataButton}
          </Button>
          {clearConfirm && (
            <button className="ml-4 text-xs text-ink-muted underline" onClick={() => setClearConfirm(false)}>
              {tr.common.cancel}
            </button>
          )}
        </div>
      </Paper>
    </div>
  );
}
