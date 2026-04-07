'use client';

import { useState } from 'react';
import { useFetch } from '@/lib/hooks';
import { Message } from '@/lib/types';

const STAGE_LABELS: Record<string, string> = {
  outreach: 'Initial Outreach',
  spark_code: 'Spark Code Request',
  creative_brief: 'Creative Brief',
  welcome: 'Welcome / Shipping',
  nudge: 'Content Nudge',
  celebration: 'First Sale Celebration',
};

const CHANNEL_LABELS: Record<string, string> = {
  euka: 'Euka Bot',
  email: 'Email',
};

export default function MessagesPage() {
  const { data: messages, loading, error } = useFetch<Message[]>('/api/messages');
  const [stageFilter, setStageFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (loading) return <div className="animate-pulse h-96 bg-gray-200 rounded-xl" />;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!messages) return null;

  const filtered = messages.filter((m) => {
    if (stageFilter !== 'all' && m.funnelStage !== stageFilter) return false;
    if (channelFilter !== 'all' && m.channel !== channelFilter) return false;
    return true;
  });

  // Group by funnel stage
  const grouped = filtered.reduce<Record<string, Message[]>>((acc, msg) => {
    const key = msg.funnelStage;
    if (!acc[key]) acc[key] = [];
    acc[key].push(msg);
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Message Library</h1>
        <p className="text-gray-500 text-sm mt-1">All message variants organized by funnel stage</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="all">All Stages</option>
          {Object.entries(STAGE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <select
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="all">All Channels</option>
          <option value="euka">Euka Bot</option>
          <option value="email">Email</option>
        </select>
      </div>

      {/* Message Groups */}
      <div className="space-y-8">
        {Object.entries(grouped).map(([stage, msgs]) => (
          <div key={stage}>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              {STAGE_LABELS[stage] || stage}
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{msgs.length} variant{msgs.length !== 1 ? 's' : ''}</span>
            </h2>
            <div className="space-y-3">
              {msgs.map((msg) => (
                <div key={msg.messageId} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  {/* Header - always visible */}
                  <button
                    onClick={() => setExpandedId(expandedId === msg.messageId ? null : msg.messageId)}
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        msg.channel === 'euka' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {CHANNEL_LABELS[msg.channel]}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{msg.variantLabel}</span>
                      {msg.isCurrent && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Current</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {msg.usedInTests && (
                        <span className="text-xs text-gray-400">Used in: {msg.usedInTests}</span>
                      )}
                      <span className="text-gray-400 text-sm">
                        {expandedId === msg.messageId ? '\u25B2' : '\u25BC'}
                      </span>
                    </div>
                  </button>

                  {/* Expanded body */}
                  {expandedId === msg.messageId && (
                    <div className="px-5 pb-4 border-t border-gray-100">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed mt-3 bg-gray-50 rounded-lg p-4">
                        {msg.fullCopy}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-gray-400 text-sm">No messages match your filters</p>
      )}
    </div>
  );
}
