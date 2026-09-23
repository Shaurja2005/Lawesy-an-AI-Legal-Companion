'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile, type UserProfile } from '@/hooks/use-profile';
import { Paper } from '@/components/ui/paper';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import type { Role, Goal, Expertise, OutputLanguage } from '@/lib/schemas/ai';
import { useI18n } from '@/components/providers/i18n-provider';

export default function OnboardingPage() {
  const router = useRouter();
  const { tr } = useI18n();
  const { profile, saveProfile, loading } = useProfile();
  
  // Use local state for form editing before saving
  const [form, setForm] = useState<UserProfile>(profile);

  // Sync form when profile loads
  const prevLoading = useState(loading)[0];
  if (!loading && prevLoading) {
    setForm(profile);
  }

  const handleSave = async () => {
    await saveProfile({ ...form, isOnboarded: true });
    router.push('/desk');
  };

  const handleSkip = async () => {
    await saveProfile({ isOnboarded: true });
    router.push('/desk');
  };

  if (loading) return null;

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="text-center mb-8">
        <h1 className="font-heading font-semibold text-3xl text-ink">{tr.onboarding.title}</h1>
        <p className="text-ink-muted mt-2 font-ui">{tr.onboarding.subtitle}</p>
      </div>

      <Paper variant="lined" padding="lg" className="space-y-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-ink mb-1">{tr.onboarding.roleLabel}</label>
            <Select 
              value={form.role} 
              onValueChange={val => setForm({ ...form, role: val as Role })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={tr.onboarding.rolePlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(tr.roles).map(r => (
                  <SelectItem key={r} value={r}>{tr.roles[r]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink mb-1">{tr.onboarding.goalLabel}</label>
            <Select 
              value={form.goal} 
              onValueChange={val => setForm({ ...form, goal: val as Goal })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={tr.onboarding.goalPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(tr.goals).map(g => (
                  <SelectItem key={g} value={g}>{tr.goals[g]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink mb-1">{tr.onboarding.expertiseLabel}</label>
            <Select 
              value={form.expertise} 
              onValueChange={val => setForm({ ...form, expertise: val as Expertise })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={tr.onboarding.expertisePlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(tr.expertise).map(x => (
                  <SelectItem key={x} value={x}>{tr.expertise[x]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-ink mb-1">{tr.onboarding.countryLabel}</label>
              <Input 
                value={form.jurisdiction.country} 
                onChange={e => setForm({ ...form, jurisdiction: { ...form.jurisdiction, country: e.target.value } })}
                placeholder={tr.onboarding.countryPlaceholder}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink mb-1">{tr.onboarding.regionLabel}</label>
              <Input 
                value={form.jurisdiction.region || ''} 
                onChange={e => setForm({ ...form, jurisdiction: { ...form.jurisdiction, region: e.target.value } })}
                placeholder={tr.onboarding.regionPlaceholder}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink mb-1">{tr.onboarding.languageLabel}</label>
            <Select 
              value={form.outputLanguage} 
              onValueChange={val => setForm({ ...form, outputLanguage: val as OutputLanguage })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={tr.onboarding.languagePlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(tr.languages).map(l => (
                  <SelectItem key={l} value={l}>{tr.languages[l]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-paper-line">
            <div>
              <label className="block text-sm font-semibold text-ink">{tr.onboarding.redactLabel}</label>
              <p className="text-xs text-ink-muted">{tr.onboarding.redactDescription}</p>
            </div>
            <Switch 
              checked={form.redactPII}
              onCheckedChange={(checked) => setForm({ ...form, redactPII: checked })}
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={handleSave} className="flex-1">{tr.onboarding.saveButton}</Button>
          <Button onClick={handleSkip} variant="ghost" className="flex-1">{tr.onboarding.skipButton}</Button>
        </div>
      </Paper>
    </div>
  );
}
