import React from 'react';

interface PageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined };
}

export default async function LoginPage(props: PageProps) {
  const resolvedParams = props.searchParams ? await props.searchParams : {};

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-xl">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In to BidPulse</h2>
        {resolvedParams.message && (
          <div className="p-3 mb-4 text-sm bg-blue-900/50 border border-blue-700 text-blue-200 rounded">
            {resolvedParams.message}
          </div>
        )}
      </div>
    </div>
  );
}
