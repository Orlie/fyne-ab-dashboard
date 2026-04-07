'use client';

import { useState } from 'react';

interface MessageEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MessageEditor({ value, onChange, placeholder }: MessageEditorProps) {
  const [sampleName, setSampleName] = useState('Sarah');

  const previewText = value.replace(/\{name\}/g, sampleName || '{name}');

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Left column: Editor */}
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Message Copy
        </label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 min-h-[200px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors resize-y"
        />
        <p className="mt-1 text-xs text-gray-400">
          {value.length} characters
        </p>
      </div>

      {/* Right column: Preview */}
      <div className="flex flex-col">
        <div className="flex items-center gap-3 mb-1">
          <label className="text-sm font-medium text-gray-700">Preview</label>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400">Name:</span>
            <input
              type="text"
              value={sampleName}
              onChange={(e) => setSampleName(e.target.value)}
              className="w-24 rounded border border-gray-300 bg-white px-2 py-0.5 text-xs text-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
            />
          </div>
        </div>
        <div className="flex-1 min-h-[200px] rounded-lg bg-gray-50 border border-gray-200 p-4">
          <p className="text-sm text-gray-700 font-sans whitespace-pre-wrap">
            {previewText || <span className="text-gray-400 italic">Your message preview will appear here...</span>}
          </p>
        </div>
      </div>
    </div>
  );
}
