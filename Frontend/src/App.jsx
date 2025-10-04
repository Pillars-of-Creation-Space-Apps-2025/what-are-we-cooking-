import { useRef, useState } from 'react';
import './App.css'
import { Upload, Orbit, Eclipse, SunMoon, Telescope, Satellite, Loader, Rocket, FileText, Download, Zap } from 'lucide-react';
import FloatingIcon from './FloatingIcons';


function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [hasSelectedFile, setHasSelectedFile] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGettingResult, setIsGettingResult] = useState(false)
  const fileInputRef = useRef(null);
  const [resultReady, setResultReady] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [resultFile, setResultFile] = useState(null)

  const icons = [
    { icon: Satellite, color: 'indigo' },
    { icon: Orbit, color: 'purple' },
    { icon: Eclipse, color: 'blue' },
    { icon: SunMoon, color: 'cyan' },
    { icon: Telescope, color: 'violet' }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      hasSelectedFile(true)
      setResultReady(false);
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
      hasSelectedFile(true)
      setResultReady(false);
    }
  };

  const handleClick = () => {
    if (!selectedFile) {
      return fileInputRef.current?.click()
    }

    setResultFile(selectedFile)
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setResultReady(true);
    }, 1500);

    setTimeout(() => {
      setHasSelectedFile(false)
    }, 3000);
  }

  // const getData = async() => {
  //   try {
  //     setIsGettingResult(true)
  //     setResultFile(selectedFile)
  //   } catch (error) {
  //     console.log(error);

  //   } finally {
  //     setIsGettingResult(false)
  //     setIsAnalyzing(false)
  //   }
  // }


  const handleDownload = () => {
    setDownloading(true);

    // get file to download
    const url = window.URL.createObjectURL(resultFile);
    const link = document.createElement('a');
    link.href = url;
    link.download = resultFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    setTimeout(() => setDownloading(false), 2000);
  };



  return (
    <main>
      {/* input */}
      <div className="relative from-slate-900">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Floating icons */}
        {icons.map((item, index) => (
          <FloatingIcon key={index} icon={item.icon} index={index} total={icons.length} />
        ))}

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-4 py-12 md:px-6 lg:px-8">
          <div className="w-full max-w-4xl mx-auto text-center space-y-8">
            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Pale<span className='text-red-500'>Blue</span>Dot
              </h1>
              <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto -mt-2">Analyze your dataset to aggresively determine the presence of an ExoPlanet</p>
            </div>

            {/* File upload area */}
            <div className="mt-12">
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`relative mx-auto max-w-2xl p-8 md:p-12 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer group
                
                   backdrop-blur-sm`
                }
              >
                <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" accept=".csv"
                />

                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {selectedFile ? <Rocket className="w-8 h-8 md:w-10 md:h-10 text-white" /> : <Upload className="w-8 h-8 md:w-10 md:h-10 text-white" />}
                  </div>

                  <div className="text-center space-y-2">
                    {selectedFile ? (
                      <p className="text-indigo-300 text-lg font-medium">{selectedFile.name}</p>
                    ) : (
                      <>
                        <p className="text-white text-lg md:text-xl font-medium">
                          Drop your file here or click to browse
                        </p>
                        <p className="text-slate-400 text-sm md:text-base">
                          Supports only CSV files
                        </p>
                      </>
                    )}
                  </div>

                  <button className="mt-4 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-indigo-500/50" onClick={handleClick} disabled={isAnalyzing}>
                    {selectedFile ? <>{isAnalyzing ?
                      <div className='flex items-center gap-2'><Loader className='animate-spin' /> Sending</div> : "Send"}</> : 'Upload File'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* result */}
      <div>
        {resultReady &&
          <div className="relative min-h-[60vh] bg-gradient-to-br from-slate-600 via-indigo-950 to-slate-700 overflow-hidden">
            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center justify-center px-4 py-12">
              <div className="w-full max-w-3xl mx-auto">
                {/* Download Card */}
                <div className="bg-slate-800/30 backdrop-blur-sm border border-indigo-500/30 rounded-2xl p-6 md:p-8 shadow-2xl flex items-center justify-between">
                  {/* File Info */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="w-7 h-7 md:w-8 md:h-8 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl md:text-2xl font-bold text-white truncate">
                        Your File is Ready
                      </h2>
                      <p className="text-slate-400 text-sm md:text-base mt-1">
                        {resultFile.name}
                      </p>
                    </div>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="group relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-indigo-500/50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <Download className={`w-5 h-5 ${downloading ? 'animate-bounce' : 'group-hover:animate-bounce'}`} />
                      <span className="text-lg">
                        {downloading ? 'Downloading...' : 'Download File'}
                      </span>
                    </div>

                    {/* Shine effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>}
      </div>
    </main>
  )
}

export default App
