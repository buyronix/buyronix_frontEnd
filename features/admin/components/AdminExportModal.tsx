"use client";

import * as React from "react";
import {
  FileSpreadsheet,
  ExternalLink,
  CheckCircle2,
  Mail,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { exportToGoogleSheets } from "../api/adminApi";
import type { VerificationStatus, GoogleSheetsExportResponse } from "../types";

interface AdminExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatusFilter: "ALL" | VerificationStatus;
  accessToken?: string | null;
}

function ExportFormContent({
  currentStatusFilter,
  accessToken,
  onClose,
}: {
  currentStatusFilter: "ALL" | VerificationStatus;
  accessToken?: string | null;
  onClose: () => void;
}) {
  const [sheetTitle, setSheetTitle] = React.useState<string>("Buyronix Sellers Export");
  const [statusFilter, setStatusFilter] = React.useState<"ALL" | VerificationStatus>(
    currentStatusFilter
  );
  const [shareEmail, setShareEmail] = React.useState<string>("");
  const [makePublic, setMakePublic] = React.useState<boolean>(true);
  const [isExporting, setIsExporting] = React.useState<boolean>(false);
  const [result, setResult] = React.useState<GoogleSheetsExportResponse | null>(null);
  const [copiedLink, setCopiedLink] = React.useState<boolean>(false);

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsExporting(true);
    try {
      const resp = await exportToGoogleSheets(
        {
          sheetTitle: sheetTitle.trim(),
          status: statusFilter === "ALL" ? undefined : statusFilter,
          shareWithEmail: shareEmail.trim() || undefined,
          makePublic,
        },
        accessToken
      );
      setResult(resp);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyLink = () => {
    if (!result?.spreadsheetUrl) return;
    navigator.clipboard.writeText(result.spreadsheetUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (result) {
    return (
      <div className="py-4 space-y-4">
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-xs">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <span>Spreadsheet Generated Successfully</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Total <span className="font-semibold text-foreground font-mono">{result.totalExported}</span> seller records exported.
          </p>
        </div>

        <div className="p-3 bg-muted/60 rounded-lg border border-border/70 flex items-center justify-between gap-2">
          <span className="text-xs font-mono text-muted-foreground truncate max-w-[260px]">
            {result.spreadsheetUrl}
          </span>
          <button
            type="button"
            onClick={handleCopyLink}
            className="text-xs font-medium text-foreground hover:text-primary inline-flex items-center gap-1 shrink-0 px-2 py-1 bg-background rounded border border-border shadow-2xs"
          >
            {copiedLink ? (
              <>
                <Check className="size-3 text-emerald-600" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="size-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Close
          </Button>
          <a
            href={result.spreadsheetUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Open Google Sheet</span>
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleExport} className="space-y-4 my-2">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">
          Spreadsheet Title
        </label>
        <Input
          type="text"
          required
          value={sheetTitle}
          onChange={(e) => setSheetTitle(e.target.value)}
          placeholder="e.g. Buyronix Verified Stores 2026"
          className="h-9 text-xs"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">
          Status Filter
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`py-1.5 text-[11px] font-semibold rounded-md border text-center transition-all ${
                statusFilter === status
                  ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                  : "bg-muted/40 text-muted-foreground border-border/80 hover:bg-muted"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground flex items-center justify-between">
          <span>Share with Email (Optional)</span>
          <span className="text-[10px] text-muted-foreground">Google Account</span>
        </label>
        <div className="relative">
          <Mail className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="email"
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
            placeholder="admin@example.com"
            className="pl-8 h-9 text-xs"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <input
          id="make-public-check"
          type="checkbox"
          checked={makePublic}
          onChange={(e) => setMakePublic(e.target.checked)}
          className="size-4 rounded border-input text-primary focus:ring-primary"
        />
        <label htmlFor="make-public-check" className="text-xs text-foreground cursor-pointer">
          Create accessible link (anyone with link can view)
        </label>
      </div>

      <DialogFooter className="pt-2 flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={isExporting}
          className="text-xs"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="default"
          size="sm"
          disabled={isExporting}
          className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
        >
          {isExporting ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <FileSpreadsheet className="size-3.5" />
              <span>Generate Spreadsheet</span>
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function AdminExportModal({
  isOpen,
  onClose,
  currentStatusFilter,
  accessToken,
}: AdminExportModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-6 bg-card border border-border shadow-2xl">
        <DialogHeader>
          <div className="size-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-2">
            <FileSpreadsheet className="size-5" />
          </div>
          <DialogTitle className="text-lg font-bold text-foreground">
            Export Sellers to Google Sheets
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Generate a live Google Sheets spreadsheet containing seller details, GST numbers, and verification records.
          </DialogDescription>
        </DialogHeader>

        {isOpen && (
          <ExportFormContent
            currentStatusFilter={currentStatusFilter}
            accessToken={accessToken}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

