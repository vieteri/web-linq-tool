'use client';
import React, { useState, useEffect } from 'react';
import CodeEditor from '@/components/CodeEditor';

// Define a type for the API response
type ApiResponse = {
  output: string;
  error?: string;
};

const HomePage = () => {
  const [query1, setQuery1] = useState('// Enter your code here. Output is generated by AI');
  const [query2, setQuery2] = useState('// Enter your code here. Output is generated by AI');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('process.env:', process.env);
  }, []);

  const handleRunCode = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query1 }),
      });

      if (!response.ok) {
        const errorData: ApiResponse = await response.json();
        throw new Error(errorData.error || 'Failed to fetch data');
      }

      const data: ApiResponse = await response.json();
      setQuery2(data.output);
    } catch (error) {
      // Use type narrowing for error handling
      const errorMessage = error instanceof Error 
        ? error.message 
        : String(error);
      setQuery2(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <h1 style={{ marginBottom: '20px', color: 'var(--foreground)' }}>Viet Linqpad alternative</h1>
      <div className="input-output-container">
        <div className="input-container" style={{display: 'flex', flexDirection: 'row', gap: '20px'}}>
          <div style={{flex: 1}}>
            <h3 style={{ marginTop: '20px', color: 'var(--foreground)' }}>Input</h3>
            <CodeEditor 
              className="code-editor-container" 
              value={query1} 
              language="csharp" 
              onChange={(value) => setQuery1(value || '')} 
              style={{ minHeight: '500px', height: '70vh' }}
            />
          </div>
          <div style={{flex: 1}}>
            <h3 style={{ marginTop: '20px', color: 'var(--foreground)' }}>Output</h3>
            <CodeEditor 
              className="code-editor-container" 
              value={query2} 
              language="csharp" 
              onChange={(value) => setQuery2(value || '')} 
              style={{ minHeight: '500px', height: '70vh' }}
            />
          </div>
        </div>
      </div>
      <button 
        className="run-code-button"
        onClick={handleRunCode}
        disabled={loading}
      >
        {loading ? (
          <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
            <div className="loading-spinner"></div>
            <span>AI is running the code. Please wait...</span>
          </div>
        ) : (
          'Run Code'
        )}
      </button>
    </div>
  );
};

export default HomePage;