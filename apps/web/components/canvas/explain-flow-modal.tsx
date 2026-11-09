"use client";

import { X, BookOpen, Loader2, RefreshCw, Download, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { GnaniSpeechPlayer } from "./gnani-speech-player";

interface ExplainFlowModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCancel?: () => void;
    onGenerate?: () => void;
    onRegenerate?: () => void;
    onDownload?: () => void;
    onClear?: () => void;
    explanation: string | null;
    isExplaining: boolean;
    error: string | null;
}

export function ExplainFlowModal({
    isOpen,
    onClose,
    onCancel,
    onGenerate,
    onRegenerate,
    onDownload,
    onClear,
    explanation,
    isExplaining,
    error,
}: ExplainFlowModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => {
            onClose();
            if (isExplaining && onCancel) onCancel();
        }}>
            <div 
                className="flex w-full max-w-4xl max-h-[90vh] flex-col border-[3px] border-[#161616] bg-[#fffdf5] shadow-[12px_12px_0_#161616] animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b-[3px] border-[#161616] bg-[#9cf57a] px-5 py-4 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="grid h-8 w-8 place-items-center bg-white border-[2px] border-[#161616]">
                            <BookOpen size={18} strokeWidth={3} className="text-[#161616]" />
                        </div>
                        <h2 className="m-0 text-lg md:text-xl font-black uppercase tracking-wide text-[#161616]">
                            Packet Flow Walkthrough
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        {explanation && !isExplaining && (
                            <>
                                {onRegenerate && (
                                    <button
                                        onClick={onRegenerate}
                                        className="neo-button flex items-center gap-1.5 bg-[#ffde59] px-2.5 py-1.5 text-xs font-black uppercase border-[2px] border-[#161616] shadow-[2px_2px_0_#161616] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[1px_1px_0_#161616]"
                                        title="Regenerate"
                                    >
                                        <RefreshCw size={14} strokeWidth={3} />
                                        <span className="hidden sm:inline">Regenerate</span>
                                    </button>
                                )}
                                {onDownload && (
                                    <button
                                        onClick={onDownload}
                                        className="neo-button flex items-center gap-1.5 bg-[#5de2e7] px-2.5 py-1.5 text-xs font-black uppercase border-[2px] border-[#161616] shadow-[2px_2px_0_#161616] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[1px_1px_0_#161616]"
                                        title="Download"
                                    >
                                        <Download size={14} strokeWidth={3} />
                                        <span className="hidden sm:inline">Download</span>
                                    </button>
                                )}
                                {onClear && (
                                    <button
                                        onClick={onClear}
                                        className="neo-button flex items-center gap-1.5 bg-[#ff6b6b] text-white px-2.5 py-1.5 text-xs font-black uppercase border-[2px] border-[#161616] shadow-[2px_2px_0_#161616] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[1px_1px_0_#161616]"
                                        title="Clear Result"
                                    >
                                        <Trash2 size={14} strokeWidth={3} />
                                        <span className="hidden sm:inline">Clear</span>
                                    </button>
                                )}
                                <div className="w-px h-6 bg-[#161616] mx-1 opacity-20 hidden sm:block"></div>
                            </>
                        )}
                        <button
                            onClick={() => {
                                onClose();
                                if (isExplaining && onCancel) onCancel();
                            }}
                            className="neo-button grid h-8 w-8 place-items-center bg-white text-black hover:bg-gray-100 border-[2px] border-[#161616] shrink-0"
                            title="Close"
                        >
                            <X size={18} strokeWidth={3} />
                        </button>
                    </div>
                </div>

                
      {explanation && !isExplaining && (
        <div className="px-5 py-3 border-b-[3px] border-[#161616]">
          <GnaniSpeechPlayer text={explanation} />
        </div>
      )}

      {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    {/* Empty State */}
                    {!explanation && !isExplaining && !error && (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <BookOpen size={64} strokeWidth={1.5} className="mb-4 text-gray-400" />
                            <h3 className="mb-2 text-2xl font-black uppercase">Explain Architecture Flow</h3>
                            <p className="mb-8 max-w-md text-sm font-bold text-gray-600">
                                Run the AI engine to generate a step-by-step simple English walkthrough of the entire packet lifecycle based on your logic and routing configuration.
                            </p>
                            {onGenerate && (
                                <button
                                    onClick={onGenerate}
                                    className="neo-button flex items-center gap-2 bg-[#9cf57a] px-8 py-4 text-lg font-black uppercase text-[#161616] shadow-[4px_4px_0_#161616] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_#161616] transition-all"
                                >
                                    <BookOpen size={20} strokeWidth={3} />
                                    Generate Explanation
                                </button>
                            )}
                        </div>
                    )}
                    {isExplaining && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <Loader2 size={48} strokeWidth={3} className="mb-6 animate-spin text-[#9cf57a]" />
                            <h3 className="text-xl font-black uppercase animate-pulse">Studying Architecture...</h3>
                            <p className="mt-2 text-sm font-bold text-gray-600 max-w-sm mx-auto">
                                The AI is tracing every wire, checking every logic condition, and mapping latency rules to write your explanation.
                            </p>
                            {onCancel && (
                                <button
                                    onClick={onCancel}
                                    className="neo-button mt-6 flex items-center gap-2 bg-[#ff6b6b] px-6 py-2 text-white border-[3px] border-[#161616] shadow-[4px_4px_0_#161616] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_#161616] transition-all"
                                >
                                    <X size={16} strokeWidth={3} />
                                    <span className="font-black uppercase tracking-wider text-sm">Cancel</span>
                                </button>
                            )}
                        </div>
                    )}

                    {error && !isExplaining && (
                        <div className="border-[3px] border-[#161616] bg-[#ff6b6b] p-6 text-white text-center">
                            <h3 className="text-xl font-black uppercase mb-2">Error Generating Flow</h3>
                            <p className="font-bold">{error}</p>
                        </div>
                    )}

                    {explanation && !isExplaining && (
                        <div className="flex-1 prose prose-sm md:prose-base max-w-none text-black prose-headings:font-black prose-headings:uppercase prose-strong:font-black prose-a:text-[#5de2e7] prose-li:font-bold prose-p:font-bold prose-headings:border-b-2 prose-headings:border-[#161616] prose-headings:pb-2">
                            <ReactMarkdown
                                components={{
                                    pre({ children }: any) {
                                        return (
                                            <div className="bg-[#161616] text-[#9cf57a] p-4 rounded-none border-[3px] border-[#161616] shadow-[4px_4px_0_#161616] overflow-x-auto my-6 font-mono text-xs whitespace-pre [&>code]:!bg-transparent [&>code]:!border-0 [&>code]:!p-0">
                                                {children}
                                            </div>
                                        )
                                    },
                                    code({ className, children, ...props }: any) {
                                        return (
                                            <code className="bg-gray-200 px-1.5 py-0.5 font-black border-[2px] border-[#161616] text-xs" {...props}>
                                                {children}
                                            </code>
                                        )
                                    },
                                    blockquote({children}) {
                                        return (
                                            <blockquote className="border-l-[4px] border-[#ffde59] bg-[#fff9db] p-4 my-4 font-bold italic shadow-[4px_4px_0_#161616]">
                                                {children}
                                            </blockquote>
                                        )
                                    }
                                }}
                            >
                                {explanation}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
