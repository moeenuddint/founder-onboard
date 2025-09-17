"use client";

import { useState, useRef } from "react";
import { apiClient } from "@/lib/api";
import { Upload, FileText, X } from "lucide-react";
import toast from "react-hot-toast";

interface FileUploadProps {
  onUploadSuccess?: () => void;
}

export default function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await uploadFile(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await uploadFile(files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload PDF, PPTX, or XLSX files only");
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    // debugger
    // const newFile = new File([file], `${localStorage.getItem("userId")}_${file.name}`, {
    //   type: file.type,
    //   lastModified: file.lastModified
    // });

    setIsUploading(true);
    try {
      await apiClient.uploadFile(file);
      toast.success("File uploaded successfully!");
      onUploadSuccess?.();
    } catch (error) {
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const getFileTypeDisplay = (mimeType: string) => {
    switch (mimeType) {
      case "application/pdf":
        return "PDF";
      case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      case "application/vnd.ms-powerpoint":
        return "PPTX";
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      case "application/vnd.ms-excel":
        return "XLSX";
      default:
        return "File";
    }
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 hover:border-gray-400"
          } ${isUploading ? "pointer-events-none opacity-50" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept=".pdf,.pptx,.xlsx"
          onChange={handleFileSelect}
          disabled={isUploading}
        />

        <div className="flex flex-col items-center">
          {isUploading ? (
            <div className="w-12 h-12 mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          ) : (
            <Upload className="w-12 h-12 mb-4 text-gray-400" />
          )}

          <h3 className="mb-2 text-lg font-medium text-gray-900">
            {isUploading ? "Uploading..." : "Upload Documents"}
          </h3>

          <p className="mb-4 text-gray-500">
            Drag and drop your files here, or click to browse
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 text-sm text-red-800 bg-red-100 rounded-full">
              PDF
            </span>
            <span className="px-3 py-1 text-sm text-orange-800 bg-orange-100 rounded-full">
              PPTX
            </span>
            <span className="px-3 py-1 text-sm text-green-800 bg-green-100 rounded-full">
              XLSX
            </span>
          </div>

          <p className="mt-2 text-xs text-gray-400">Maximum file size: 10MB</p>
        </div>
      </div>
    </div>
  );
}
