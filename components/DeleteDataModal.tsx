"use client";

import React, { useState } from "react";
import { X, CheckCircle } from "lucide-react";

interface DeleteDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  roastId?: string;
  onDeletedSuccess: () => void;
}

export function DeleteDataModal({ isOpen, onClose, roastId, onDeletedSuccess }: DeleteDataModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/data/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roastId }),
      });

      if (res.ok) {
        setDeleted(true);
        setTimeout(() => {
          onDeletedSuccess();
          onClose();
        }, 1500);
      } else {
        alert("Failed to delete user data. Please try again.");
      }
    } catch (err) {
      console.error("Delete data failed:", err);
      alert("Network error deleting data.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#333333]/70">
      <div className="relative w-full max-w-md bg-[#ffffff] border-2 border-[#333333] p-4 sm:p-6 text-left max-h-[92dvh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b-2 border-[#333333]">
          <h3 className="font-display text-[20px] text-[#ef3b2c] uppercase">
            DELETE MY DATA
          </h3>
          <button
            onClick={onClose}
            className="p-1 bg-[#ffffff] border-2 border-[#333333] hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-[#333333]" />
          </button>
        </div>

        {/* Body */}
        <div className="py-4 text-[13px] text-[#333333] space-y-3">
          {deleted ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <CheckCircle className="w-10 h-10 text-[#007fff] mb-2" />
              <p className="font-display text-[18px] text-[#333333] uppercase">DATA PERMANENTLY DELETED</p>
              <p className="text-[12px] text-[#333333] mt-1">All cache, sessions, and roast logs have been purged.</p>
            </div>
          ) : (
            <>
              <p className="font-bold">
                Clicking delete will immediately and permanently:
              </p>
              <ul className="text-[12px] text-[#333333] space-y-1.5 list-disc list-inside">
                <li>Purge your cached roast result from our server</li>
                <li>Clear any temporary session cookies in your browser</li>
                <li>Invalidate any active share links for this roast</li>
              </ul>
              <p className="text-[11px] text-[#333333] italic pt-2">
                Remember, your YouTube credentials are never stored permanently, and your token was already revoked after generation.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        {!deleted && (
          <div className="pt-3 border-t-2 border-[#333333] flex justify-end gap-2.5">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="py-2 px-4 bg-[#ffffff] text-[#333333] hover:bg-gray-100 font-bold text-[12px] uppercase border-2 border-[#333333] cursor-pointer"
            >
              CANCEL
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="py-2 px-4 bg-[#ef3b2c] text-[#ffffff] hover:bg-[#ef3b2c]/90 font-bold text-[12px] uppercase border-2 border-[#333333] transition-transform active:translate-y-0.5 cursor-pointer"
            >
              {isDeleting ? "DELETING..." : "PERMANENTLY PURGE"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
