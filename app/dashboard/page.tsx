"use client";

import { useState } from "react";
import { useAuth } from "@/lib/providers/AuthContextProvider";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Download, Eye, Clock } from "lucide-react";
import { VideoModal } from "@/components/dashboard/video-modal";
import type { Id } from "@/convex/_generated/dataModel";

interface Message {
  _id: Id<"messages">;
  recipientId: Id<"friends">;
  videoStorageId: Id<"_storage">;
  title: string;
  isViewed: boolean;
}

export default function DashboardPage() {
  const { session } = useAuth();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const messages = useQuery(
    api.messages.getMyMessages,
    session ? { recipientId: session.id as Id<"friends"> } : "skip"
  );

  const getDownloadUrl = useAction(api.messages.getDownloadUrl);
  const markAsViewed = useMutation(api.messages.markAsViewed);

  const handleWatchVideo = (message: Message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  const handleDownload = async (message: Message) => {
    try {
      const url = await getDownloadUrl({ storageId: message.videoStorageId });

      const link = document.createElement("a");
      link.href = url;
      link.download = `${message.title}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleVideoStarted = async (messageId: Id<"messages">) => {
    try {
      await markAsViewed({ messageId });
    } catch (error) {
      console.error("Failed to mark as viewed:", error);
    }
  };

  if (!session) {
    return null;
  }

  if (messages === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary/20 border-t-primary"></div>
          <p className="text-muted-foreground">Loading your messages...</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 p-4 bg-primary/10 rounded-full">
          <Play className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          No messages yet
        </h2>
        <p className="text-muted-foreground max-w-md">
          {"Joshua hasn't sent you any video messages yet. Check back soon!"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome, {session.name}
          </h1>
          <h2 className="text-xl font-semibold text-foreground/80">
            Your Video Messages
          </h2>
        </div>
        <p className="text-muted-foreground">
          You have {messages.filter((m) => !m.isViewed).length} new message
          {messages.filter((m) => !m.isViewed).length !== 1 ? "s" : ""} from
          Joshua
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {messages.map((message) => (
          <Card
            key={message._id}
            className="group hover:shadow-xl transition-all duration-300 bg-card/90 backdrop-blur-sm border-border/50 hover:scale-[1.02] transform"
          >
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-lg font-semibold text-card-foreground leading-tight flex-1 min-w-0 wrap-break-word whitespace-normal">
                  {message.title}
                </CardTitle>
                <Badge
                  variant={message.isViewed ? "secondary" : "default"}
                  className={`shrink-0`}
                >
                  {message.isViewed ? (
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>Viewed</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>New</span>
                    </div>
                  )}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => handleWatchVideo(message)}
                  className="w-full sm:flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-colors hover:cursor-pointer"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Watch Now
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleDownload(message)}
                  className="w-full sm:w-auto px-4 hover:bg-muted transition-colors hover:cursor-pointer"
                  title="Download video"
                >
                  <Download className="h-4 w-4" />
                  Save Video
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <VideoModal
        message={selectedMessage}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMessage(null);
        }}
        onVideoStarted={handleVideoStarted}
      />
    </div>
  );
}
