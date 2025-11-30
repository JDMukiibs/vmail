"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/providers/AuthContextProvider";
import { setFriendSession } from "@/lib/auth/auth-utils";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export default function LoginPage() {
  const [accessCode, setAccessCode] = useState("");
  const [codeToVerify, setCodeToVerify] = useState<string | null>(null);
  const [attemptedCode, setAttemptedCode] = useState<string | null>(null);
  const router = useRouter();
  const { session, login } = useAuth();

  const authResult = useQuery(
    api.friends.authenticateByCode,
    codeToVerify ? { code: codeToVerify } : "skip"
  );

  const isLoading = codeToVerify !== null && authResult === undefined;

  const error = useMemo(() => {
    if (codeToVerify && authResult === null && attemptedCode === codeToVerify) {
      return "Invalid access code. Please try again.";
    }
    return "";
  }, [codeToVerify, authResult, attemptedCode]);

  useMemo(() => {
    if (authResult && codeToVerify) {
      const { id, name } = authResult;
      setFriendSession(id, name);
      login(id, name);
      router.replace("/dashboard");
    }
  }, [authResult, codeToVerify, login, router]);

  if (session) {
    router.replace("/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accessCode.trim()) {
      return;
    }

    const code = accessCode.trim();
    setAttemptedCode(code);
    setCodeToVerify(code);
  };

  const handleRetry = () => {
    setCodeToVerify(null);
    setAttemptedCode(null);
    setAccessCode("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md shadow-lg border-0 bg-card">
        <CardHeader className="space-y-6 text-center pb-8">
          {/* Logo Container */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center bg-primary/10 rounded-2xl">
            <div className="relative h-14 w-14">
              <Image
                src="/logo-removebg-preview.png"
                alt="VMail Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-3">
            <CardTitle className="text-3xl font-bold text-foreground">
              VMail by Joshua
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base leading-relaxed">
              Enter your access code to view your personal video messages
            </CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 px-8">
            <div className="space-y-3">
              <Label
                htmlFor="accessCode"
                className="text-sm font-medium text-foreground"
              >
                Access Code
              </Label>
              <Input
                id="accessCode"
                type="text"
                placeholder="Enter your access code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="h-12 text-base bg-background border-border focus:ring-primary focus:border-primary"
                disabled={isLoading}
                autoFocus
              />
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 space-y-3">
                <p className="text-sm text-destructive font-medium">{error}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  className="text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  Try again
                </Button>
              </div>
            )}
          </CardContent>

          <CardFooter className="px-8 pb-8 pt-2">
            <Button
              type="submit"
              className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isLoading || !accessCode.trim()}
            >
              {isLoading ? (
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground/20 border-t-primary-foreground"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                "Access Messages"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
