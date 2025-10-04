# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


import { useRef, useState } from 'react';
import './App.css';
import {
  Upload, Rocket, Loader, Download, FileText,
  Satellite, Orbit, Eclipse, SunMoon, Telescope
} from 'lucide-react';
import FloatingIcon from './FloatingIcons';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resultReady, setResultReady] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const fileInputRef = useRef(null);

  const icons = [
    { icon: Satellite, color: 'indigo' },
    { icon: Orbit, color: 'purple' },
    { icon: Eclipse, color: 'blue' },
    { icon: SunMoon, color: 'cyan' },
    { icon: Telescope, color: 'violet' },
  ];

  // --- Event Handlers ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setResultReady(false); // reset result when new file selected
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setResultReady(false);
    }
  };

  const handleClick = () => {
    if (!selectedFile) {
      fileInputRef.current?.click();
      return;
    }

    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setResultReady(true); // ✅ Show result section
    }, 1500); // simulate delay
  };

  const handleDownload = () => {
    setDownloading(true);

    const content = "This is your downloaded file content.\n\nThank you for using our service!";
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile?.name?.replace(/\.[^/.]+$/, "") + "_result.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    setTimeout(() => setDownloading(false), 2000);
  };

  return (
    <main>
      <div className="relative from-slate-900">
        {/* Background blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Floating Icons */}
        {icons.map((item, i) => (
          <FloatingIcon key={i} icon={item.icon} index={i} total={icons.length} />
        ))}

        {/* Upload Area */}
        <div className="relative z-10 flex flex-col items-center justify-center px-4 py-12 md:px-6 lg:px-8">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-white leading-tight">
                Pale<span className='text-red-500'>Blue</span>Dot
              </h1>
              <p className="text-slate-300 max-w-2xl mx-auto -mt-2">
                Analyze your dataset to aggressively determine the presence of an ExoPlanet
              </p>
            </div>

            <div className="mt-12">
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleClick}
                className={`relative mx-auto max-w-2xl p-8 md:p-12 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer group
                ${selectedFile ? 'border-indigo-400 bg-indigo-500/10' : 'border-indigo-500/30 bg-slate-800/30 hover:bg-slate-800/50 hover:border-indigo-400/50'}
                backdrop-blur-sm`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".csv"
                />

                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {selectedFile ? <Rocket className="w-8 h-8 text-white" /> : <Upload className="w-8 h-8 text-white" />}
                  </div>

                  <div className="text-center space-y-2">
                    {selectedFile ? (
                      <p className="text-indigo-300 text-lg font-medium">{selectedFile.name}</p>
                    ) : (
                      <>
                        <p className="text-white text-lg font-medium">
                          Drop your file here or click to browse
                        </p>
                        <p className="text-slate-400 text-sm">Supports only CSV files</p>
                      </>
                    )}
                  </div>

                  {/* ✅ FIXED: onClick added here */}
                  <button
                    onClick={handleClick}
                    disabled={isAnalyzing}
                    className="mt-4 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-indigo-500/50"
                  >
                    {selectedFile ? (
                      isAnalyzing ? (
                        <div className='flex items-center gap-2'>
                          <Loader className='animate-spin' /> Sending
                        </div>
                      ) : "Send"
                    ) : "Upload File"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Show result card if file is processed */}
      {resultReady && selectedFile && (
        <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 overflow-hidden">
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
            <div className="w-full max-w-3xl mx-auto">
              <div className="bg-slate-800/30 backdrop-blur-sm border border-indigo-500/30 rounded-2xl p-6 md:p-8 shadow-2xl flex items-center justify-between">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold text-white truncate">Your File is Ready</h2>
                    <p className="text-slate-400 text-sm md:text-base mt-1">{selectedFile.name}</p>
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="group relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-indigo-500/50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-center gap-3">
                    <Download className={`w-5 h-5 ${downloading ? 'animate-bounce' : 'group-hover:animate-bounce'}`} />
                    <span className="text-lg">{downloading ? 'Downloading...' : 'Download File'}</span>
                  </div>
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
