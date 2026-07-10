import React, { useState } from "react";
import { Upload, Image as ImageIcon, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ReceiptUploadProps {
  receiptFile: File | null;
  onChange: (file: File | null) => void;
}

export default function ReceiptUpload({
  receiptFile,
  onChange,
}: ReceiptUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]);
    }
  };

  const removeFile = () => {
    onChange(null);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-[13px] font-bold text-slate-700">
        Drop-off Receipt <span className="text-slate-400 font-medium">(Optional)</span>
      </Label>
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-[20px] p-6 text-center transition-all cursor-pointer",
          dragActive
            ? "border-primary bg-primary/5"
            : receiptFile
              ? "border-emerald-200 bg-emerald-50/10"
              : "border-slate-200 bg-white hover:bg-slate-50/50"
        )}
      >
        <input
          id="receipt-file"
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
        <label htmlFor="receipt-file" className="cursor-pointer flex flex-col items-center gap-2 w-full h-full">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
            <Upload size={20} className="text-primary" />
          </div>
          <div>
            <p className="font-bold text-[13px] text-primary hover:underline">Upload photo or PDF</p>
            <p className="text-[11px] text-slate-400 mt-0.5 font-semibold">
              JPG, PNG, PDF
            </p>
          </div>
        </label>
      </div>

      {/* Uploaded File Preview */}
      <AnimatePresence>
        {receiptFile && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="bg-white rounded-[16px] p-3 flex items-center justify-between border border-emerald-100 shadow-sm mt-1"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-[10px] bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 overflow-hidden">
                {receiptFile.type.startsWith("image/") ? (
                  <ImageIcon size={18} />
                ) : (
                  <FileText size={18} />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-slate-700 truncate">{receiptFile.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {(receiptFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={removeFile}
              className="h-8 w-8 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50"
            >
              <X size={16} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
