# ─── Build Vite (React) ─────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Biến Vite phải có lúc build (embed vào bundle). Override khi build: --build-arg VITE_API_BASE_URL=...
ARG VITE_API_BASE_URL=
ARG VITE_RAG_UPLOAD_FIELD=file
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_RAG_UPLOAD_FIELD=$VITE_RAG_UPLOAD_FIELD

RUN npm run build

# ─── Serve static với Nginx ─────────────────────────────────────────────────
FROM nginx:1.27-alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget -q --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
