import React from 'react';

interface PageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined };
}

export default async function FitScorePage(props: PageProps) {
  const resolvedParams = props.searchParams ? await props.searchParams : {};
  
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Fit Score Analysis</h1>
      <p className="text-slate-400">Opportunity ID: {typeof resolvedParams.id === 'string' ? resolvedParams.id : 'N/A'}</p>
    </div>
  );
}
