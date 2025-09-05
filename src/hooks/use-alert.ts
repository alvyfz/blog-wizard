"use client";

// Re-export dari alert context untuk kemudahan akses
export { useAlert, useAlertHelpers, type AlertOptions } from "@/contexts/alert-context";

/**
 * Hook untuk menggunakan alert dialog
 * 
 * @example
 * ```tsx
 * const { showAlert, showConfirm } = useAlert();
 * 
 * // Menampilkan alert sederhana
 * showAlert({ title: "Berhasil", description: "Data telah disimpan" });
 * 
 * // Menampilkan konfirmasi
 * const confirmed = await showConfirm({ 
 *   title: "Hapus Data", 
 *   description: "Apakah Anda yakin?" 
 * });
 * ```
 */