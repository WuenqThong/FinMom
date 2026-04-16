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

  /** Binance Futures testnet — WebSocket v2/account.position (chỉ dev/testnet; secret lộ trong bundle) */
  readonly VITE_BINANCE_FUTURES_TESTNET_API_KEY?: string;
  readonly VITE_BINANCE_FUTURES_TESTNET_API_SECRET?: string;
  /** Alias tên ngắn (cùng ý với TESTNET_*) */
  readonly VITE_BINANCE_FUTURES_API_KEY?: string;
  readonly VITE_BINANCE_FUTURES_API_SECRET?: string;
  /** Mặc định: wss://testnet.binancefuture.com/ws-fapi/v1 */
  readonly VITE_BINANCE_FUTURES_WS_URL?: string;
  readonly VITE_BINANCE_POSITION_SYMBOL?: string;
  readonly VITE_BINANCE_FUTURES_SYMBOL?: string;
  readonly VITE_BINANCE_POSITION_POLL_MS?: string;
  readonly VITE_BINANCE_FUTURES_POLL_MS?: string;
}
