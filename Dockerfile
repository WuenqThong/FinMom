# ─── Build Vite (React) ─────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Biến Vite phải có lúc build (embed vào bundle). Override: --build-arg VITE_API_BASE_URL=...
ARG VITE_API_BASE_URL=https://finmom-production.up.railway.app
ARG VITE_RAG_UPLOAD_FIELD=file
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_RAG_UPLOAD_FIELD=$VITE_RAG_UPLOAD_FIELD

RUN npm run build

# ─── Serve static với Nginx ─────────────────────────────────────────────────
FROM nginx:1.27-alpine

# Trùng giá trị với builder để runtime-config (envsubst) khớp bundle khi dùng --build-arg
ARG VITE_API_BASE_URL=https://finmom-production.up.railway.app
ARG VITE_RAG_UPLOAD_FIELD=file
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_RAG_UPLOAD_FIELD=$VITE_RAG_UPLOAD_FIELD

RUN apk add --no-cache gettext

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/runtime-config.js.template /docker/runtime-config.js.template
COPY docker/docker-entrypoint.sh /docker/docker-entrypoint.sh
RUN chmod +x /docker/docker-entrypoint.sh

COPY --from=builder /app/dist /usr/share/nginx/html
# Luôn có bản tĩnh (dev / fallback); entrypoint ghi đè bằng envsubst khi chạy container.
COPY --from=builder /app/public/runtime-config.js /usr/share/nginx/html/runtime-config.js

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget -q --spider http://127.0.0.1/ || exit 1

ENTRYPOINT ["/docker/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
