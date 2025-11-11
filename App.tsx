import React, { useState, useCallback, useRef } from 'react';
import { generateResumeMock, RoastData } from './services/geminiService';
import { Spinner } from './components/Spinner';
import { FireIcon, ExclamationIcon, DocumentArrowUpIcon } from './components/icons';
import { RoastResultDisplay } from './components/RoastResultDisplay';

const App: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [roastLevel, setRoastLevel] = useState<number>(5);
    const [mockResult, setMockResult] = useState<RoastData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (file: File | null) => {
        if (file) {
            setSelectedFile(file);
            if (file.type.startsWith('image/')) {
                setFilePreview(URL.createObjectURL(file));
            } else {
                setFilePreview(null);
            }
        }
    };

    const handleRoastResume = useCallback(async () => {
        if (!selectedFile || isLoading) return;

        setIsLoading(true);
        setError(null);
        setMockResult(null);

        try {
            const result = await generateResumeMock(selectedFile, roastLevel);
            setMockResult(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedFile, roastLevel, isLoading]);
    
    const roastLevelLabel = (level: number) => {
        if (level <= 2) return 'Soft Roast';
        if (level <= 5) return 'Medium Roast';
        if (level <= 8) return 'Full Roast';
        return 'No Mercy! 🔥';
    };

    const dragAndDropHandlers = {
        onDragEnter: (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
        },
        onDragLeave: (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
        },
        onDragOver: (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
        },
        onDrop: (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file && ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
                handleFileChange(file);
            } else {
                setError('Invalid file type. Please upload a PDF, JPG, or PNG.');
            }
        },
    };

    const clearFile = () => {
        setSelectedFile(null);
        if (filePreview) {
            URL.revokeObjectURL(filePreview);
            setFilePreview(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-6xl">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300">
                        The Resume Mocker 🔥
                    </h1>
                    <p className="mt-2 text-lg text-gray-400">
                        Upload your resume, choose your level of pain, and get it roasted by AI.
                    </p>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gray-800 rounded-lg p-6 shadow-lg flex flex-col gap-6">
                        <div
                            className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer h-80 transition-colors ${isDragging ? 'border-orange-500 bg-gray-700/50' : 'border-gray-600 hover:border-gray-500'}`}
                            onClick={() => fileInputRef.current?.click()}
                            {...dragAndDropHandlers}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="application/pdf,image/jpeg,image/png"
                                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                                disabled={isLoading}
                            />
                            {selectedFile ? (
                                <div className="text-center">
                                    {filePreview && (
                                        <img src={filePreview} alt="Resume preview" className="max-h-32 mx-auto mb-4 rounded" />
                                    )}
                                    <p className="font-semibold text-green-400 break-all">{selectedFile.name}</p>
                                    <p className="text-sm text-gray-400">({(selectedFile.size / 1024).toFixed(2)} KB)</p>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); clearFile(); }}
                                        className="mt-4 px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded text-white"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center text-gray-400">
                                    <DocumentArrowUpIcon className="w-12 h-12 mx-auto mb-4" />
                                    <p className="font-semibold">Click to upload or drag & drop</p>
                                    <p className="text-sm">PDF, PNG, or JPG</p>
                                </div>
                            )}
                        </div>
                        
                        <div>
                            <label htmlFor="roastLevel" className="block text-sm font-medium text-gray-300 mb-2">
                                Choose your roast level: <span className="font-bold text-orange-400">{roastLevel} - {roastLevelLabel(roastLevel)}</span>
                            </label>
                            <input
                                type="range"
                                id="roastLevel"
                                min="1"
                                max="10"
                                value={roastLevel}
                                onChange={(e) => setRoastLevel(Number(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                disabled={isLoading}
                                aria-label="Roast intensity slider"
                            />
                        </div>

                        <div className="flex justify-center mt-2">
                            <button
                                onClick={handleRoastResume}
                                disabled={isLoading || !selectedFile}
                                className="inline-flex items-center justify-center px-8 py-3 font-semibold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:scale-100"
                            >
                                {isLoading ? (
                                    <>
                                        <Spinner />
                                        Roasting...
                                    </>
                                ) : (
                                    <>
                                        <FireIcon className="w-5 h-5 mr-2" />
                                        Roast My Resume
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg shadow-lg p-6 min-h-[400px] flex flex-col">
                        {error && (
                            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex items-center mb-4" role="alert">
                                <ExclamationIcon className="w-5 h-5 mr-3" />
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                        
                        <div className="w-full h-full flex items-center justify-center flex-1 overflow-y-auto">
                             {isLoading ? (
                                <div className="text-center text-gray-400">
                                    <Spinner size="lg" />
                                    <p className="mt-4 text-lg animate-pulse">Sharpening my insults...</p>
                                </div>
                            ) : mockResult ? (
                                <RoastResultDisplay data={mockResult} />
                            ) : (
                                <p className="text-gray-500 text-center">Your brutally honest (and hilarious) feedback awaits...</p>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;