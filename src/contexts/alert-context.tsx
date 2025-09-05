"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface AlertOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  hideCancelButton?: boolean;
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
  showConfirm: (options: AlertOptions) => Promise<boolean>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [alertOptions, setAlertOptions] = useState<AlertOptions | null>(null);
  const [resolvePromise, setResolvePromise] = useState<
    ((value: boolean) => void) | null
  >(null);

  const showAlert = (options: AlertOptions) => {
    setAlertOptions(options);
    setIsOpen(true);
  };

  const showConfirm = (options: AlertOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setAlertOptions(options);
      setResolvePromise(() => resolve);
      setIsOpen(true);
    });
  };

  const handleConfirm = async () => {
    if (alertOptions?.onConfirm) {
      await alertOptions.onConfirm();
    }
    if (resolvePromise) {
      resolvePromise(true);
      setResolvePromise(null);
    }
    setIsOpen(false);
    setAlertOptions(null);
  };

  const handleCancel = () => {
    if (alertOptions?.onCancel) {
      alertOptions.onCancel();
    }
    if (resolvePromise) {
      resolvePromise(false);
      setResolvePromise(null);
    }
    setIsOpen(false);
    setAlertOptions(null);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleCancel();
    }
  };

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertOptions?.title}</AlertDialogTitle>
            {alertOptions?.description && (
              <AlertDialogDescription>
                {alertOptions.description}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            {!alertOptions?.hideCancelButton && (
              <AlertDialogCancel onClick={handleCancel}>
                {alertOptions?.cancelText || "Cancel"}
              </AlertDialogCancel>
            )}

            <AlertDialogAction
              onClick={handleConfirm}
              className={
                alertOptions?.variant === "destructive"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : undefined
              }
            >
              {alertOptions?.confirmText || "OK"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}

// Custom hook untuk helper functions
export const useAlertHelpers = () => {
  const { showAlert, showConfirm } = useAlert();

  return {
    alert: (title: string, description?: string) => {
      showAlert({ title, description });
    },

    confirm: (title: string, description?: string): Promise<boolean> => {
      return showConfirm({ title, description });
    },

    success: (title: string, description?: string, onConfirm?: () => void) => {
      showAlert({
        title,
        description,
        confirmText: "OK",
        variant: "default",
        hideCancelButton: true,
        onConfirm,
      });
    },

    error: (title: string, description?: string) => {
      showAlert({
        title,
        description,
        confirmText: "OK",
        variant: "destructive",
      });
    },

    confirmDelete: (
      title: string = "Hapus Item",
      description?: string
    ): Promise<boolean> => {
      return showConfirm({
        title,
        description:
          description ||
          "Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.",
        confirmText: "Hapus",
        cancelText: "Batal",
        variant: "destructive",
      });
    },
  };
};
