'use client';

import React, { useState } from 'react';

interface DownloadButtonProps {
  fileName: string;
  fileUrl: string;
}

export default function DownloadButton({ fileName, fileUrl }: DownloadButtonProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleDownload = () => {
    // Direct programmatic download (no popup window trigger)
    const anchor = document.createElement('a');
    anchor.href = fileUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    // Show in-app toast notification
    setToastMessage(`Downloading ${fileName}...`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <>
      <button
        onClick={handleDownload}
        className="px-4 py-2 bg-[#2563EB] hover:bg-blue-500 active:scale-95 text-white font-bold text-xs rounded-xl transition shadow-md flex items-center gap-2"
      >
        <span>Download Package</span>
        <span aria-hidden="true">&darr;</span>
      </button>

      {/* Floating In-App Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 border border-emerald-500/40 shadow-2xl shadow-black/80 text-white text-xs animate-in fade-in slide-in-from-bottom-4">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold text-emerald-300">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white font-bold"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}