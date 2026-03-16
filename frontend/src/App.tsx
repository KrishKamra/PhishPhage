import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Link as LinkIcon, Zap, Search, Loader2 } from 'lucide-react';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!emailContent.trim()) return;
    
    setIsAnalyzing(true);
    setShowResults(false);

    try {
      // 1. Send the email text to your Python backend
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: emailContent }),
      });

      if (!response.ok) {
        throw new Error("Failed to connect to the backend.");
      }

      // 2. Get the real AI prediction
      const data = await response.json();

      // 3. Map the backend data to match the format your UI expects
      const realResults = {
        isPhishing: data.is_phishing,
        confidence: parseFloat(data.confidence), // Converts "98.50%" to 98.5
        urgencyLevel: data.analysis.urgency_level.toLowerCase(),
        triggerWords: data.analysis.trigger_words_found,
        links: data.analysis.link_details.map((link: any) => ({
          url: link.url,
          status: link.is_suspicious ? "suspicious" : "safe",
          reason: link.reason,
        })),
        explanation: data.explanation,
      };

      // 4. Update the state to trigger the UI reveal
      setResults(realResults);
      setShowResults(true);

    } catch (error) {
      console.error("Error:", error);
      alert("Error: Make sure your Python FastAPI server is running on port 8000!");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setEmailContent('');
    setShowResults(false);
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAzYy0xLjY1NyAwLTMgMS4zNDMtMyAzczEuMzQzIDMgMyAzIDMtMS4zNDMgMy0zLTEuMzQzLTMtMy0zeiIgZmlsbD0iIzFmMjkzNyIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30"></div>

      <div className="relative z-10">
        <header className="border-b border-white/10 backdrop-blur-xl bg-white/5">
          <div className="max-w-6xl mx-auto px-6 py-5 flex items-center gap-3">
            <Shield className="w-7 h-7 text-blue-400" strokeWidth={2} />
            <h1 className="text-2xl font-semibold tracking-tight">PhishGuard</h1>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-12">
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-4xl font-bold tracking-tight">Detect Phishing Emails Instantly</h2>
              <p className="text-slate-400 text-lg">Advanced AI-powered email analysis to protect you from threats</p>
            </div>

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl transition-all duration-200 hover:bg-white/[0.07] hover:border-white/20">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label htmlFor="email-input" className="block text-sm font-medium text-slate-300">
                    Email Content
                  </label>
                  <textarea
                    id="email-input"
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    placeholder="Paste the full email content here, including sender, subject, and body text..."
                    rows={12}
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !emailContent.trim()}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 disabled:shadow-none"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        <span>Analyze Email</span>
                      </>
                    )}
                  </button>

                  {showResults && (
                    <button
                      onClick={handleReset}
                      className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-3.5 px-6 rounded-xl transition-all duration-200"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {showResults && results && (
              <div className="space-y-6 animate-fade-in">
                <div className={`backdrop-blur-xl border-2 rounded-2xl p-8 shadow-2xl transition-all duration-200 ${
                  results.isPhishing
                    ? 'bg-red-500/10 border-red-500/30 hover:border-red-500/50'
                    : 'bg-green-500/10 border-green-500/30 hover:border-green-500/50'
                }`}>
                  <div className="flex items-start gap-6">
                    <div className={`p-4 rounded-2xl ${results.isPhishing ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                      {results.isPhishing ? (
                        <AlertTriangle className="w-10 h-10 text-red-400" strokeWidth={2} />
                      ) : (
                        <CheckCircle className="w-10 h-10 text-green-400" strokeWidth={2} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-3xl font-bold mb-2 ${results.isPhishing ? 'text-red-400' : 'text-green-400'}`}>
                        {results.isPhishing ? 'Phishing Detected' : 'Likely Legitimate'}
                      </h3>
                      <div className="flex items-baseline gap-3">
                        <span className="text-5xl font-bold">{results.confidence}%</span>
                        <span className="text-slate-400 text-lg">confidence</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl hover:bg-white/[0.07] hover:border-white/20 transition-all duration-200">
                    <div className="flex items-center gap-3 mb-4">
                      <Zap className="w-5 h-5 text-amber-400" />
                      <h4 className="font-semibold text-slate-200">Urgency Level</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wide ${
                        results.urgencyLevel === 'high'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : results.urgencyLevel === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : 'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}>
                        {results.urgencyLevel}
                      </span>
                    </div>
                  </div>

                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl hover:bg-white/[0.07] hover:border-white/20 transition-all duration-200 md:col-span-2">
                    <div className="flex items-center gap-3 mb-4">
                      <AlertTriangle className="w-5 h-5 text-orange-400" />
                      <h4 className="font-semibold text-slate-200">Trigger Words</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {results.triggerWords.map((word: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-orange-500/20 border border-orange-500/30 text-orange-300 rounded-lg text-sm font-medium"
                        >
                          {word}
                        </span>
                      ))}
                      {results.triggerWords.length === 0 && (
                        <span className="text-slate-400 italic">None detected</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl hover:bg-white/[0.07] hover:border-white/20 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-5">
                    <LinkIcon className="w-5 h-5 text-blue-400" />
                    <h4 className="font-semibold text-slate-200">Links Found</h4>
                  </div>
                  <div className="space-y-3">
                    {results.links.map((link: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl hover:border-slate-600/50 transition-all duration-200"
                      >
                        <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                          link.status === 'suspicious' ? 'bg-red-500' : 'bg-green-500'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <div className="font-mono text-sm text-slate-300 break-all mb-1">{link.url}</div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs font-semibold uppercase tracking-wide ${
                              link.status === 'suspicious' ? 'text-red-400' : 'text-green-400'
                            }`}>
                              {link.status}
                            </span>
                            <span className="text-xs text-slate-500">•</span>
                            <span className="text-xs text-slate-400">{link.reason}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {results.links.length === 0 && (
                      <span className="text-slate-400 italic">No links found in email</span>
                    )}
                  </div>
                </div>

                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl hover:bg-white/[0.07] hover:border-white/20 transition-all duration-200">
                  <h4 className="font-semibold text-slate-200 mb-3">Analysis Explanation</h4>
                  <p className="text-slate-300 leading-relaxed">
                    {results.explanation}
                  </p>
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