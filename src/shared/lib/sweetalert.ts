import Swal from "sweetalert2";

const baseTheme = {
  confirmButtonColor: "#E8A0BF",
  cancelButtonColor: "#6B6B80",
  background: "#FFFFFF",
  color: "#2D2D3F",
  customClass: {
    popup: "swal-cheerfully-popup",
  },
};

export const swal = {
  toast: (title: string, icon: "success" | "error" | "info" = "success") =>
    Swal.fire({
      ...baseTheme,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      title,
      icon,
    }),

  confirm: (title: string, text: string) =>
    Swal.fire({
      ...baseTheme,
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, lanjutkan",
      cancelButtonText: "Batal",
    }),

  success: (title: string, text?: string) =>
    Swal.fire({
      ...baseTheme,
      title,
      text,
      icon: "success",
      confirmButtonText: "OK",
    }),

  error: (title: string, text?: string) =>
    Swal.fire({
      ...baseTheme,
      title,
      text,
      icon: "error",
      confirmButtonText: "OK",
    }),

  delete: (itemName: string) =>
    Swal.fire({
      ...baseTheme,
      title: `Hapus ${itemName}?`,
      text: "Tindakan ini tidak dapat dibatalkan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E57373",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }),
};
