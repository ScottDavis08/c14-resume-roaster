'use client';

import { useState } from 'react';

export default function Home() {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [roastResult, setRoastResult] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/roast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resume, jobDescription }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to roast resume');
      }
      
      const data = await response.json();
      setRoastResult(data.result);
    } catch (error) {
      console.error('Error roasting resume:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 md:p-24">
      <div className="w-full max-w-3xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Resume Roaster</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="resume" className="block text-lg font-medium mb-2">
              Your Resume
            </label>
            <textarea
              id="resume"
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              className="w-full h-60 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Paste your resume text here..."
              required
            />
          </div>
          
          <div>
            <label htmlFor="jobDescription" className="block text-lg font-medium mb-2">
              Job Description
            </label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full h-60 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Paste the job description here..."
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Roasting...' : 'Roast My Resume 🔥'}
          </button>
        </form>
        
        {roastResult && (
          <div className="mt-8 p-6 bg-gray-100 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">The Roast</h2>
            <div className="whitespace-pre-wrap">{roastResult}</div>
          </div>
        )}
      </div>
    </main>
  );
}