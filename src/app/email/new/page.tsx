'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from '@/lib/hooks';
import { EmailTest } from '@/lib/types';

const today = () => new Date().toISOString().slice(0, 10);

export default function NewEmailTestPage() {
  const router = useRouter();
  const { mutate, loading, error } = useMutation<EmailTest>('/api/email', 'POST');

  // Test Info
  const [testId, setTestId] = useState('');
  const [testName, setTestName] = useState('');
  const [testType, setTestType] = useState<EmailTest['testType']>('subject_line');
  const [status, setStatus] = useState<EmailTest['status']>('running');
  const [startDate, setStartDate] = useState(today());
  const [endDate, setEndDate] = useState('');

  // Variant A
  const [aName, setAName] = useState('');
  const [aSent, setASent] = useState(0);
  const [aOpens, setAOpens] = useState(0);
  const [aOpenRate, setAOpenRate] = useState(0);
  const [aClicks, setAClicks] = useState(0);
  const [aCtr, setACtr] = useState(0);
  const [aReplies, setAReplies] = useState(0);

  // Variant B
  const [bName, setBName] = useState('');
  const [bSent, setBSent] = useState(0);
  const [bOpens, setBOpens] = useState(0);
  const [bOpenRate, setBOpenRate] = useState(0);
  const [bClicks, setBClicks] = useState(0);
  const [bCtr, setBCtr] = useState(0);
  const [bReplies, setBReplies] = useState(0);

  // Result
  const [winner, setWinner] = useState<EmailTest['winner']>('');
  const [notes, setNotes] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const test: EmailTest = {
      testId,
      testName,
      testType,
      status,
      startDate,
      endDate,
      variantA: {
        name: aName,
        sent: aSent,
        opens: aOpens,
        openRate: aOpenRate,
        clicks: aClicks,
        ctr: aCtr,
        replies: aReplies,
      },
      variantB: {
        name: bName,
        sent: bSent,
        opens: bOpens,
        openRate: bOpenRate,
        clicks: bClicks,
        ctr: bCtr,
        replies: bReplies,
      },
      winner,
      notes,
    };

    try {
      await mutate(test);
      router.push('/email');
    } catch {
      // error is set by useMutation
    }
  }

  const inputClass = 'border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white w-full';
  const labelClass = 'text-sm font-medium text-gray-700 mb-1';
  const cardClass = 'bg-white rounded-xl border border-gray-200 shadow-sm p-6';

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/email" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
        &larr; Back to Email Tests
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-6">Create Email A/B Test</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-6">
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Test Info */}
        <div className={cardClass}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Test ID</label>
              <input
                type="text"
                value={testId}
                onChange={(e) => setTestId(e.target.value)}
                placeholder="email-subj-002"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Test Name</label>
              <input
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Test Type</label>
              <select
                value={testType}
                onChange={(e) => setTestType(e.target.value as EmailTest['testType'])}
                className={inputClass}
              >
                <option value="subject_line">Subject Line</option>
                <option value="email_body">Email Body</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as EmailTest['status'])}
                className={inputClass}
              >
                <option value="running">Running</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Variant A */}
        <div className={cardClass}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Variant A</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelClass}>Name</label>
              <input
                type="text"
                value={aName}
                onChange={(e) => setAName(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Sent</label>
              <input
                type="number"
                value={aSent}
                onChange={(e) => setASent(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Opens</label>
              <input
                type="number"
                value={aOpens}
                onChange={(e) => setAOpens(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Open Rate (e.g. 0.08 for 8%)</label>
              <input
                type="number"
                step="0.001"
                value={aOpenRate}
                onChange={(e) => setAOpenRate(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Clicks</label>
              <input
                type="number"
                value={aClicks}
                onChange={(e) => setAClicks(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>CTR (e.g. 0.08 for 8%)</label>
              <input
                type="number"
                step="0.001"
                value={aCtr}
                onChange={(e) => setACtr(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Replies</label>
              <input
                type="number"
                value={aReplies}
                onChange={(e) => setAReplies(Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Variant B */}
        <div className={cardClass}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Variant B</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelClass}>Name</label>
              <input
                type="text"
                value={bName}
                onChange={(e) => setBName(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Sent</label>
              <input
                type="number"
                value={bSent}
                onChange={(e) => setBSent(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Opens</label>
              <input
                type="number"
                value={bOpens}
                onChange={(e) => setBOpens(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Open Rate (e.g. 0.08 for 8%)</label>
              <input
                type="number"
                step="0.001"
                value={bOpenRate}
                onChange={(e) => setBOpenRate(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Clicks</label>
              <input
                type="number"
                value={bClicks}
                onChange={(e) => setBClicks(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>CTR (e.g. 0.08 for 8%)</label>
              <input
                type="number"
                step="0.001"
                value={bCtr}
                onChange={(e) => setBCtr(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Replies</label>
              <input
                type="number"
                value={bReplies}
                onChange={(e) => setBReplies(Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Result */}
        <div className={cardClass}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Result</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Winner</label>
              <select
                value={winner}
                onChange={(e) => setWinner(e.target.value as EmailTest['winner'])}
                className={inputClass}
              >
                <option value="">Not determined</option>
                <option value="variant_a">Variant A</option>
                <option value="variant_b">Variant B</option>
                <option value="none">None</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Test'}
        </button>
      </form>
    </div>
  );
}
