import { useState, useMemo } from 'react';
import { 
  Shield, AlertTriangle, CheckCircle, Link as LinkIcon, 
  Zap, Search, Loader2, Download, Trash2, MessageSquareWarning 
} from 'lucide-react';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [isReported, setIsReported] = useState(false);

  // Memoized word count for performance
  const wordCount = useMemo(() => {
    return emailContent.trim() ? emailContent.trim().split(/\s+/).length : 0;
  }, [emailContent]);

  // --- NEW FEATURE: TRIGGER WORD HIGHLIGHTER ---
  const getHighlightedText = () => {
    if (!results || !results.triggerWords || results.triggerWords.length === 0) {
      return emailContent;
    }

    let highlighted = emailContent;
    // Sort words by length descending to avoid partial matches on shorter words
    const sortedTriggers = [...results.triggerWords].sort((a, b) => b.length - a.length);
    
    // Use a function to wrap matches in a styled span
    const parts = highlighted.split(new RegExp(`(${sortedTriggers.join('|')})`, 'gi'));
    
    return parts.map((part, i) => {
      const isMatch = sortedTriggers.some(trigger => trigger.toLowerCase() === part.toLowerCase());
      return isMatch ? (
        <span key={i} className="bg-orange-500/40 text-orange-200 px-1 rounded border border-orange-500/50 font-bold">
          {part}
        </span>
      ) : (
        part
      );
    });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEmailContent(e.target.value);
    setIsReported(false); // Reset report status if text changes
  };

  const handleAnalyze = async () => {
    if (wordCount < 5) {
      alert("⚠️ Analysis Required: Please provide at least 5 words to ensure model accuracy.");
      return;
    }

    setIsAnalyzing(true);
    setShowResults(false);
    setIsReported(false);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: emailContent }),
      });

      if (!response.ok) throw new Error("Failed to connect to the backend.");

      const data = await response.json();

      const realResults = {
        isPhishing: data.is_phishing,
        confidence: parseFloat(data.confidence),
        urgencyLevel: data.analysis.urgency_level.toLowerCase(),
        triggerWords: data.analysis.trigger_words_found,
        links: data.analysis.link_details.map((link: any) => ({
          url: link.url,
          status: link.is_suspicious ? "suspicious" : "safe",
          reason: link.reason,
        })),
        explanation: data.explanation,
      };

      setResults(realResults);
      setShowResults(true);
    } catch (error) {
      console.error("Error:", error);
      alert("Connection Error: Ensure your FastAPI server is running on port 8000.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setEmailContent('');
    setShowResults(false);
    setResults(null);
    setIsReported(false);
  };

  const downloadReport = () => {
    if (!results) return;
    const report = `PHISHPHAGE ANALYSIS REPORT\n--------------------------\nStatus: ${results.isPhishing ? 'PHISHING DETECTED' : 'LIKELY SAFE'}\nConfidence: ${results.confidence}%\nUrgency: ${results.urgencyLevel.toUpperCase()}\nTrigger Words Found: ${results.triggerWords.join(', ') || 'None'}\nExplanation: ${results.explanation}`;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PhishPhage_Report_${new Date().getTime()}.txt`;
    link.click();
  };

  // --- NEW FEATURE: SIMULATED FEEDBACK LOOP ---
  const handleReportFalsePositive = () => {
    setIsReported(true);
    console.log("FEEDBACK LOGGED:", { content: emailContent, original_label: results.isPhishing });
    // In production, this would be an API call to save the sample for retraining
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30">
      <div className="relative z-10">
        <header className="border-b border-white/10 backdrop-blur-xl bg-white/5 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-7 h-7 text-blue-400" />
              <h1 className="text-2xl font-bold tracking-tight">PhishPhage</h1>
            </div>
            <span className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30">v1.1.0 (Feedback Enabled)</span>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-12">
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-4xl font-extrabold tracking-tight">Email Security Auditor</h2>
              <p className="text-slate-400 text-lg">AI forensic analysis with linguistic trigger mapping</p>
            </div>

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-medium text-slate-300">Email Content</label>
                    <span className={`text-xs font-mono ${wordCount < 5 ? 'text-red-400' : 'text-green-400'}`}>
                      {wordCount} / 5 words (Min)
                    </span>
                  </div>
                  
                  {/* Dynamic Switch: Show highlighter if results exist, otherwise show Textarea */}
                  {showResults ? (
                    <div className="w-full min-h-62.5 bg-slate-900/80 border border-blue-500/30 rounded-xl px-4 py-3 text-slate-200 leading-relaxed overflow-y-auto">
                      {getHighlightedText()}
                    </div>
                  ) : (
                    <textarea
                      value={emailContent}
                      onChange={handleTextChange}
                      placeholder="Paste suspicious email content here..."
                      rows={10}
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                    />
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || wordCount < 5}
                    className="flex-1 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? <Loader2 className="animate-spin" /> : <Search />}
                    {showResults ? "Re-Analyze" : "Start Analysis"}
                  </button>

                  <button onClick={handleReset} className="p-4 bg-slate-800 hover:bg-red-900/40 rounded-xl transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {showResults && results && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={`backdrop-blur-xl border-2 rounded-2xl p-8 shadow-2xl transition-all ${
                  results.isPhishing 
                    ? results.confidence > 90 ? 'bg-red-500/20 border-red-500' : 'bg-orange-500/10 border-orange-500/50'
                    : 'bg-green-500/10 border-green-500/50'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-6">
                      <div className={`p-4 rounded-2xl ${results.isPhishing ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                        {results.isPhishing ? <AlertTriangle className="w-10 h-10 text-red-400" /> : <CheckCircle className="w-10 h-10 text-green-400" />}
                      </div>
                      <div>
                        <h3 className={`text-3xl font-bold mb-2 ${results.isPhishing ? 'text-red-400' : 'text-green-400'}`}>
                          {results.isPhishing ? 'Threat Detected' : 'Safe Communication'}
                        </h3>
                        <div className="flex items-baseline gap-3">
                          <span className="text-5xl font-black">{results.confidence}%</span>
                          <span className="text-slate-400 text-lg font-medium italic">ML confidence score</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={downloadReport} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                      <Download className="w-4 h-4" /> Export Report
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Zap className="w-5 h-5 text-amber-400" />
                      <h4 className="font-semibold">Urgency</h4>
                    </div>
                    <span className={`px-4 py-1.5 rounded-lg font-black text-xs uppercase ${
                      results.urgencyLevel === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {results.urgencyLevel} Priority
                    </span>
                  </div>

                  <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <LinkIcon className="w-5 h-5 text-blue-400" />
                      <h4 className="font-semibold">Linguistic Triggers Found</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {results.triggerWords.map((word: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-300 rounded text-xs font-mono">
                          {word}
                        </span>
                      ))}
                      {results.triggerWords.length === 0 && <span className="text-slate-500 text-sm">No suspicious keywords identified</span>}
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h4 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                    AI Forensic Explanation
                  </h4>
                  <p className="text-slate-400 leading-relaxed text-sm italic">"{results.explanation}"</p>
                </div>

                {/* --- NEW FEATURE: FEEDBACK LOOP UI --- */}
                <div className="pt-6 border-t border-white/5 flex flex-col items-center gap-4">
                   <p className="text-slate-500 text-sm">Was this analysis accurate?</p>
                   {isReported ? (
                     <div className="flex items-center gap-2 text-green-400 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20 text-sm">
                       <CheckCircle className="w-4 h-4" /> Feedback logged for model retraining
                     </div>
                   ) : (
                     <button 
                       onClick={handleReportFalsePositive}
                       className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs border border-white/10 px-4 py-2 rounded-full hover:bg-white/5"
                     >
                       <MessageSquareWarning className="w-4 h-4" /> Report incorrect analysis
                     </button>
                   )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;