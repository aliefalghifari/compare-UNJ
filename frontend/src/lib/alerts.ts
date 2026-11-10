import Swal from "sweetalert2";

// Helper to determine dark mode from document class
const isDarkMode = () => {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
};

// Base config for consistent styling
const getThemeColors = () => {
  const dark = isDarkMode();
  return {
    background: dark ? "#18181b" : "#ffffff",
    color: dark ? "#f4f4f5" : "#09090b",
    confirmButtonColor: "#059669", // emerald-600
    cancelButtonColor: dark ? "#3f3f46" : "#71717a",
  };
};

/**
 * Toast notification for quick feedback
 */
export const showToast = ({
  icon,
  title,
  timer = 2200,
}: {
  icon: "success" | "info" | "warning" | "error";
  title: string;
  timer?: number;
}) => {
  const colors = getThemeColors();
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
    background: colors.background,
    color: colors.color,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  return Toast.fire({
    icon,
    title,
  });
};

/**
 * Confirmation dialog for deleting chat session
 */
export const confirmDeleteChat = async (chatTitle: string): Promise<boolean> => {
  const colors = getThemeColors();
  const result = await Swal.fire({
    title: "Hapus Sesi Chat?",
    html: `Apakah Anda yakin ingin menghapus obrolan <b>"${chatTitle}"</b>? Tindakan ini tidak dapat dibatalkan.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e11d48", // rose-600
    cancelButtonColor: colors.cancelButtonColor,
    confirmButtonText: "Ya, Hapus Chat",
    cancelButtonText: "Batal",
    background: colors.background,
    color: colors.color,
    reverseButtons: true,
    focusCancel: true,
  });

  return result.isConfirmed;
};

/**
 * Prompt dialog for renaming chat session
 */
export const promptRenameChat = async (currentTitle: string): Promise<string | null> => {
  const colors = getThemeColors();
  const result = await Swal.fire({
    title: "Ubah Nama Sesi Chat",
    input: "text",
    inputValue: currentTitle,
    inputPlaceholder: "Masukkan nama sesi baru...",
    showCancelButton: true,
    confirmButtonText: "Simpan Perubahan",
    cancelButtonText: "Batal",
    confirmButtonColor: colors.confirmButtonColor,
    cancelButtonColor: colors.cancelButtonColor,
    background: colors.background,
    color: colors.color,
    inputValidator: (value) => {
      if (!value || !value.trim()) {
        return "Nama sesi tidak boleh kosong!";
      }
      return null;
    },
  });

  if (result.isConfirmed && result.value) {
    return result.value.trim();
  }
  return null;
};

/**
 * Confirmation dialog for marking chat as resolved / active
 */
export const confirmStatusChange = async (
  currentStatus: "active" | "resolved",
  chatTitle: string
): Promise<boolean> => {
  const colors = getThemeColors();
  const nextStatus = currentStatus === "resolved" ? "Berjalan (Active)" : "Selesai (Resolved)";
  const isMarkingResolved = currentStatus === "active";

  const result = await Swal.fire({
    title: isMarkingResolved ? "Tandai Selesai?" : "Buka Kembali Sesi?",
    html: `Ubah status obrolan <b>"${chatTitle}"</b> menjadi <b>${nextStatus}</b>?`,
    icon: isMarkingResolved ? "question" : "info",
    showCancelButton: true,
    confirmButtonColor: colors.confirmButtonColor,
    cancelButtonColor: colors.cancelButtonColor,
    confirmButtonText: isMarkingResolved ? "Ya, Tandai Selesai" : "Ya, Buka Kembali",
    cancelButtonText: "Batal",
    background: colors.background,
    color: colors.color,
  });

  return result.isConfirmed;
};

export default Swal;

