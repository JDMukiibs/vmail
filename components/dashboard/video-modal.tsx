"use client";

import { useState, useRef, useEffect } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";

interface Message {
  _id: Id<"messages">;
  videoStorageId: Id<"_storage">;
  title: string;
  isViewed: boolean;
}

interface VideoModalProps {
  message: Message | null;
  isOpen: boolean;
  onClose: () => void;
  onVideoStarted: (messageId: Id<"messages">) => void;
}

export function VideoModal({
  message,
  isOpen,
  onClose,
  onVideoStarted,
}: VideoModalProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const getDownloadUrl = useAction(api.messages.getDownloadUrl);

  const loadVideo = async () => {
    if (!message) return;

    setIsLoading(true);
    setError(null);

    try {
      const url = await getDownloadUrl({ storageId: message.videoStorageId });
      setVideoUrl(url);
    } catch (err) {
      console.error("Failed to load video:", err);
      setError("Failed to load video. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && message && !videoUrl) {
      loadVideo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, message, videoUrl]);

  useEffect(() => {
    if (!isOpen) {
      setVideoUrl(null);
      setError(null);
      setHasStarted(false);
    }
  }, [isOpen]);

  const handleVideoPlay = () => {
    if (!hasStarted && message) {
      setHasStarted(true);
      onVideoStarted(message._id);
    }
  };

  const handleDownload = () => {
    if (!videoUrl || !message) return;

    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = `${message.title}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!message) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-white dark:bg-slate-950 border-border shadow-xl">
        <DialogHeader className="p-4 sm:p-6 pb-4">
          <DialogTitle className="text-lg sm:text-xl font-semibold text-foreground">
            {message.title}
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          {isLoading && (
            <div className="flex items-center justify-center py-12 bg-muted/50 rounded-lg">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading video...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-12 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="text-center">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={loadVideo} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {videoUrl && !error && (
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  className="w-full h-auto max-h-[50vh] sm:max-h-[60vh]"
                  onPlay={handleVideoPlay}
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="flex items-center space-x-2"
                  size="sm"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
