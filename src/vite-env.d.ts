/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Base path/URL cho API.
   * - Dev (tránh CORS): `/api` + cấu hình BACKEND_URL trong .env để Vite proxy.
   * - Gọi trực tiếp: `https://xxxx.ngrok-free.app` (cần backend bật CORS).
   */
  readonly VITE_API_BASE_URL?: string;
  /** Tên field multipart khi upload (mặc định file) — chỉ đổi nếu API dùng tên khác */
  readonly VITE_RAG_UPLOAD_FIELD?: string;
}
