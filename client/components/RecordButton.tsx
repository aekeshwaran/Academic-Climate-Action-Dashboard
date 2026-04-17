import React, { useState, useEffect } from 'react';
import { Mic, Video, StopCircle, RefreshCw, AlertCircle, CheckCircle2, MicOff, CameraOff } from 'lucide-react';
import { Button } from './ui/button';
import { useMediaRecorder } from '../hooks/useMediaRecorder';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface RecordButtonProps {
  type: 'audio' | 'video';
  onRecordingComplete: (blob: Blob) => void;
  className?: string;
}

export function RecordButton({ type, onRecordingComplete, className }: RecordButtonProps) {
  const { isRecording, recordingTime, startRecording, stopRecording, mediaBlob, error } = useMediaRecorder(type);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (mediaBlob) {
      onRecordingComplete(mediaBlob);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} recorded successfully!`);
    }
  }, [mediaBlob, type, onRecordingComplete]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      if (error.includes('Permission')) {
        setPermissionDenied(true);
      }
    } else {
      setPermissionDenied(false);
    }
  }, [error]);

  const handleStart = async () => {
    try {
      await startRecording();
    } catch (err) {
      // Error handled by hook's error state
    }
  };

  const handleStop = () => {
    stopRecording();
  };

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative group">
        <Button
          type="button"
          size="lg"
          variant={isRecording ? "destructive" : "outline"}
          onClick={isRecording ? handleStop : handleStart}
          className={cn(
            "rounded-full w-14 h-14 p-0 shadow-lg transition-all duration-300 transform active:scale-95 border-2",
            isRecording ? "animate-pulse ring-4 ring-destructive/20 border-red-500" : "hover:border-primary hover:text-primary",
            permissionDenied ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50" : ""
          )}
          disabled={permissionDenied}
        >
          {isRecording ? (
            <StopCircle className="w-6 h-6 animate-spin-slow" />
          ) : (
            <>
              {type === 'audio' ? <Mic className="w-6 h-6" /> : <Video className="w-6 h-6" />}
              {permissionDenied && (type === 'audio' ? <MicOff className="absolute -top-1 -right-1 w-4 h-4 text-red-500" /> : <CameraOff className="absolute -top-1 -right-1 w-4 h-4 text-red-500" />)}
            </>
          )}
        </Button>
        
        {isRecording && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-destructive text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-md animate-bounce tracking-widest">
            {formatTime(recordingTime)} REC
          </div>
        )}
      </div>

      <div className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        {isRecording ? "Recording in progress..." : `Click to record ${type}`}
      </div>

      {error && !permissionDenied && (
        <div className="flex items-center gap-1.5 text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-xl border border-red-100 mt-2 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </div>
      )}

      {permissionDenied && (
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 mt-2">
          <AlertCircle className="w-3.5 h-3.5" />
          Check Permissions
        </div>
      )}
    </div>
  );
}
