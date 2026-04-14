#!/bin/sh
set -e
export VITE_API_BASE_URL="${VITE_API_BASE_URL:-}"
export VITE_RAG_UPLOAD_FIELD="${VITE_RAG_UPLOAD_FIELD:-file}"
envsubst '${VITE_API_BASE_URL} ${VITE_RAG_UPLOAD_FIELD}' < /docker/runtime-config.js.template > /usr/share/nginx/html/runtime-config.js
exec "$@"
