"use client";

import { useEffect, useState } from "react";
import { RefreshCw, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Diagnostic {
  code: string;
  severity: "error" | "warning";
  message: string;
}

interface RepositoryHealth {
  healthy: boolean;
  version: string;
  timestamp: string;
  repository?: {
    owner: string;
    name: string;
    branch: string;
    private: boolean;
  };
  manifest?: {
    found: boolean;
    schemaVersion?: number;
    appVersion?: string;
    owner?: string;
    createdAt?: string;
    application?: string;
    theme?: string;
    language?: string;
  };
  diagnostics: Diagnostic[];
}

export function RepositoryStatus() {
  const [status, setStatus] = useState<RepositoryHealth | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/system/status");
      const data = await res.json();
      setStatus(data);
    } catch {
      setStatus({
        healthy: false,
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        diagnostics: [
          {
            code: "FETCH_FAILED",
            severity: "error",
            message: "Failed to connect to the internal system status API.",
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const activeError = status?.diagnostics?.find((d) => d.severity === "error");
  const activeWarning = status?.diagnostics?.find((d) => d.severity === "warning");

  return (
    <Card className="w-full flex flex-col gap-6 text-left">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="font-heading text-xl font-medium tracking-wide text-foreground">
          Repository
        </h3>
        <Button
          variant="ghost"
          onClick={fetchStatus}
          disabled={loading}
          className="h-8 w-8 p-0"
          aria-label="Refresh repository connection status"
        >
          <RefreshCw
            size={14}
            strokeWidth={1.5}
            className={`${loading ? "animate-spin" : ""}`}
          />
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-6">
          <p className="text-sm text-foreground/50 tracking-wide">Checking connection...</p>
        </div>
      ) : status ? (
        <div className="flex flex-col gap-4">
          {/* Status Indicator */}
          <div className="flex items-center gap-3">
            {status.healthy ? (
              <>
                <CheckCircle2 size={16} className="text-accent" aria-hidden="true" />
                <span className="text-sm font-medium text-foreground tracking-wide">
                  Connected. Your diary is ready.
                </span>
              </>
            ) : activeError ? (
              <>
                <AlertCircle size={16} className="text-red-600 dark:text-red-400" aria-hidden="true" />
                <span className="text-sm font-medium text-foreground tracking-wide">
                  Error: {activeError.code}
                </span>
              </>
            ) : (
              <>
                <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400" aria-hidden="true" />
                <span className="text-sm font-medium text-foreground tracking-wide">
                  Unhealthy connection
                </span>
              </>
            )}
          </div>

          {/* Diagnostic Messages */}
          {activeError && (
            <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-sm border border-red-200/50 dark:border-red-900/30 leading-relaxed">
              {activeError.message}
            </p>
          )}
          {!activeError && activeWarning && (
            <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-3 py-2 rounded-sm border border-amber-200/50 dark:border-amber-900/30 leading-relaxed">
              {activeWarning.message}
            </p>
          )}

          {/* Repository Metadata */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-t border-border pt-4 text-sm leading-relaxed">
            <div>
              <span className="block text-xs text-foreground/50 tracking-wide uppercase">Owner</span>
              <span className="font-medium text-foreground">
                {status.repository?.owner || "—"}
              </span>
            </div>
            <div>
              <span className="block text-xs text-foreground/50 tracking-wide uppercase">Repository</span>
              <span className="font-medium text-foreground">
                {status.repository?.name || "—"}
              </span>
            </div>
            <div>
              <span className="block text-xs text-foreground/50 tracking-wide uppercase">Branch</span>
              <span className="font-medium text-foreground">
                {status.repository?.branch || "—"}
              </span>
            </div>
            <div>
              <span className="block text-xs text-foreground/50 tracking-wide uppercase">Manifest</span>
              <span className="font-medium text-foreground">
                {status.manifest?.found && !activeError ? (
                  <span className="text-accent">Loaded (v{status.manifest.appVersion})</span>
                ) : (
                  <span className="text-foreground/50">Missing or invalid</span>
                )}
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
