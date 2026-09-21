'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile, type UserProfile } from '@/hooks/use-profile';
import { Paper } from '@/components/ui/paper';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';

export default function OnboardingPage() {
  const router = useRouter();
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
        <h1 className="font-heading font-semibold text-3xl text-ink">Welcome to Lawesy</h1>
        <p className="text-ink-muted mt-2 font-ui">Help us tailor your experience. (You can change this anytime)</p>
      </div>

      <Paper variant="lined" padding="lg" className="space-y-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-ink mb-1">Your Role</label>
            <Select 
              value={form.role} 
              onValueChange={val => setForm({ ...form, role: val as any })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tenant">Tenant</SelectItem>
                <SelectItem value="landlord">Landlord</SelectItem>
                <SelectItem value="employee">Employee / Job Seeker</SelectItem>
                <SelectItem value="employer">Employer</SelectItem>
                <SelectItem value="freelancer">Freelancer</SelectItem>
                <SelectItem value="small_business">Small Business</SelectItem>
                <SelectItem value="consumer">Consumer</SelectItem>
                <SelectItem value="notice_recipient">Received a Notice</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink mb-1">Your Goal</label>
            <Select 
              value={form.goal} 
              onValueChange={val => setForm({ ...form, goal: val as any })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="understand">Just understand what it means</SelectItem>
                <SelectItem value="decide_to_sign">Decide whether to sign</SelectItem>
                <SelectItem value="negotiate">Prepare to negotiate</SelectItem>
                <SelectItem value="resolve_dispute">Resolve a dispute</SelectItem>
                <SelectItem value="respond_to_notice">Respond to a legal notice</SelectItem>
                <SelectItem value="compare_options">Compare options</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink mb-1">Legal Expertise</label>
            <Select 
              value={form.expertise} 
              onValueChange={val => setForm({ ...form, expertise: val as any })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select expertise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New to this (Explain everything)</SelectItem>
                <SelectItem value="some">Some familiarity</SelectItem>
                <SelectItem value="comfortable">Comfortable with legal text</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-ink mb-1">Country</label>
              <Input 
                value={form.jurisdiction.country} 
                onChange={e => setForm({ ...form, jurisdiction: { ...form.jurisdiction, country: e.target.value } })}
                placeholder="e.g. US, IN, UK"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink mb-1">State / Region</label>
              <Input 
                value={form.jurisdiction.region || ''} 
                onChange={e => setForm({ ...form, jurisdiction: { ...form.jurisdiction, region: e.target.value } })}
                placeholder="Optional"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink mb-1">Language</label>
            <Select 
              value={form.outputLanguage} 
              onValueChange={val => setForm({ ...form, outputLanguage: val as any })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi (हिंदी)</SelectItem>
                <SelectItem value="ta">Tamil (தமிழ்)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-paper-line">
            <div>
              <label className="block text-sm font-semibold text-ink">Redact PII</label>
              <p className="text-xs text-ink-muted">Hide names, emails, and phone numbers before analysis.</p>
            </div>
            <Switch 
              checked={form.redactPII}
              onCheckedChange={(checked) => setForm({ ...form, redactPII: checked })}
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={handleSave} className="flex-1">Save & Continue</Button>
          <Button onClick={handleSkip} variant="ghost" className="flex-1">Skip for now</Button>
        </div>
      </Paper>
    </div>
  );
}
