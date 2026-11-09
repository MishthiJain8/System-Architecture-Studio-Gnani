"use client";

import { useState, useEffect } from 'react';
import { Sparkles, X, Loader2, Zap, Send, AlertCircle } from 'lucide-react';

import { GnaniVoiceRecorder } from "./gnani-voice-recorder";

interface AiPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (prompt: string) => void;
  onCancel?: () => void;
  isGenerating: boolean;
  progress: string;
  error: string | null;
}

const EXAMPLE_PROMPTS = [
  "E-commerce platform with microservices",
  "Real-time chat app with WebSocket",
  "ML inference pipeline with GPU workers",
  "Video streaming platform like YouTube"
];

export function AiPromptModal({
  isOpen,
  onClose,
  onGenerate,
  onCancel,
  isGenerating,
  progress,
  error
}: AiPromptModalProps) {
  const [prompt, setPrompt] = useState("");

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isGenerating) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isGenerating, onClose]);

  if (!isOpen) return null;

  const handleGenerate = () => {
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt.trim());
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-all"
      onPointerDown={(e) => {
        if (!isGenerating) onClose();
      }}
    >
      <div 
        className="w-full max-w-3xl bg-[#fffdf5] border-[3px] border-[#161616] shadow-[12px_12px_0_#161616] flex flex-col animate-in zoom-in-95 duration-200"
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-[3px] border-[#161616] p-4 bg-[#ffde59]">
          <div className="flex items-center gap-2">
            <Sparkles size={24} strokeWidth={3} className="text-[#161616]" />
            <h2 className="font-black uppercase tracking-wider text-xl m-0">AI Architect</h2>
          </div>
          <button 
            onClick={onClose}
            disabled={isGenerating}
            className="hover:bg-white/50 p-2 rounded-sm transition-colors border-[2px] border-transparent hover:border-[#161616] disabled:opacity-50"
            title="Close"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
              <Zap size={16} strokeWidth={3} className="text-[#5de2e7]" />
              Describe Your Architecture
            </label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isGenerating}
                rows={6}
                className="w-full text-base p-4 bg-white border-[3px] border-[#161616] focus:bg-[#ffde59]/10 outline-none transition-all placeholder-gray-400 font-bold resize-none shadow-[inset_2px_2px_0_rgba(0,0,0,0.05)]"
                placeholder="Describe your architecture... e.g., 'Design an e-commerce platform with React frontend, API gateway, microservices, PostgreSQL, Redis cache, and Kafka for event streaming'"
              />
              <div className="absolute bottom-3 right-3 text-xs font-black text-gray-400 bg-white/80 px-2 py-1 rounded">
                {prompt.length} chars
              </div>
            </div>
          </div>

          
      <GnaniVoiceRecorder
        disabled={isGenerating}
        onTranscript={(text) =>
          setPrompt((current) =>
            current.trim() ? `${current.trim()} ${text}` : text
          )
        }
      />

      {/* Example Chips */}
          {!isGenerating && (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase text-gray-500">Quick Start Examples:</span>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_PROMPTS.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrompt(example)}
                    className="text-xs font-bold bg-white border-[2px] border-[#161616] px-3 py-1.5 hover:bg-[#9cf57a] hover:shadow-[2px_2px_0_#161616] transition-all hover:-translate-y-0.5"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Status/Error Messages */}
          {error && (
            <div className="p-4 bg-[#ff6b6b]/10 border-[3px] border-[#ff6b6b] flex items-start gap-3">
              <AlertCircle className="text-[#ff6b6b] shrink-0 mt-0.5" size={20} strokeWidth={3} />
              <div>
                <div className="font-black uppercase text-sm text-[#ff6b6b]">Generation Failed</div>
                <div className="font-bold text-sm text-gray-800 mt-1">{error}</div>
                <div className="text-xs font-bold text-gray-600 mt-2">Please modify your prompt and try again.</div>
              </div>
            </div>
          )}

          {isGenerating && (
            <div className="p-4 bg-[#5de2e7]/10 border-[3px] border-[#5de2e7] flex items-center gap-3">
              <Loader2 className="text-[#5de2e7] animate-spin shrink-0" size={24} strokeWidth={3} />
              <div className="font-black uppercase text-sm text-gray-800">
                {progress || "Analyzing requirements and generating architecture..."}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="mt-2 flex justify-end gap-3 pt-4 border-t-[3px] border-[#161616] border-dashed">
            {isGenerating ? (
              <button
                onClick={onCancel}
                className="px-6 py-3 bg-gray-200 border-[3px] border-[#161616] font-black uppercase text-sm hover:bg-gray-300 transition-colors flex items-center gap-2 text-gray-800 shadow-[4px_4px_0_#161616] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#161616]"
              >
                <X size={16} strokeWidth={3} />
                Stop Generation
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-6 py-3 bg-white border-[3px] border-[#161616] font-black uppercase text-sm hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="px-6 py-3 bg-[#ff4fa3] border-[3px] border-[#161616] font-black uppercase text-sm text-white shadow-[4px_4px_0_#161616] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#161616] transition-all disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_#161616] flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={18} strokeWidth={3} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send size={18} strokeWidth={3} />
                  Generate Architecture
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
