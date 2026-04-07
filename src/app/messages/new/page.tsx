'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from '@/lib/hooks';
import { Message } from '@/lib/types';
import MessageEditor from '@/components/MessageEditor';

export default function NewMessagePage() {
  const router = useRouter();
  const { mutate, loading, error } = useMutation<Message>('/api/messages', 'POST');

  const [messageId, setMessageId] = useState('');
  const [funnelStage, setFunnelStage] = useState<Message['funnelStage']>('outreach');
  const [channel, setChannel] = useState<Message['channel']>('euka');
  const [variantLabel, setVariantLabel] = useState('');
  const [usedInTests, setUsedInTests] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);
  const [fullCopy, setFullCopy] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const message: Message = {
      messageId,
      funnelStage,
      channel,
      variantLabel,
      fullCopy,
      usedInTests,
      isCurrent,
    };

    try {
      await mutate(message);
      router.push('/messages');
    } catch {
      // error is set by useMutation
    }
  }

  const inputClass = 'border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white w-full';
  const labelClass = 'text-sm font-medium text-gray-700 mb-1';
  const cardClass = 'bg-white rounded-xl border border-gray-200 shadow-sm p-6';

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/messages" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
        &larr; Back to Messages
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-6">Create Message</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-6">
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Message Info */}
        <div className={cardClass}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Message Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Message ID</label>
              <input
                type="text"
                value={messageId}
                onChange={(e) => setMessageId(e.target.value)}
                placeholder="msg-008"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Funnel Stage</label>
              <select
                value={funnelStage}
                onChange={(e) => setFunnelStage(e.target.value as Message['funnelStage'])}
                className={inputClass}
              >
                <option value="outreach">Outreach</option>
                <option value="spark_code">Spark Code</option>
                <option value="creative_brief">Creative Brief</option>
                <option value="welcome">Welcome</option>
                <option value="nudge">Nudge</option>
                <option value="celebration">Celebration</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Channel</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as Message['channel'])}
                className={inputClass}
              >
                <option value="euka">Euka</option>
                <option value="email">Email</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Variant Label</label>
              <input
                type="text"
                value={variantLabel}
                onChange={(e) => setVariantLabel(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Used In Tests</label>
              <input
                type="text"
                value={usedInTests}
                onChange={(e) => setUsedInTests(e.target.value)}
                placeholder="euka-tc-001"
                className={inputClass}
              />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="isCurrent"
                checked={isCurrent}
                onChange={(e) => setIsCurrent(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="isCurrent" className="text-sm font-medium text-gray-700">
                Is Current
              </label>
            </div>
          </div>
        </div>

        {/* Message Copy */}
        <div className={cardClass}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Message Copy</h2>
          <MessageEditor
            value={fullCopy}
            onChange={setFullCopy}
            placeholder="Enter your message copy here... Use {name} for personalization."
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Message'}
        </button>
      </form>
    </div>
  );
}
