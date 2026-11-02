
# Etapa 1: build da aplicação
FROM node:24-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@10.34.9


COPY . .

RUN pnpm install --frozen-lockfile


ARG VITE_USE_MOCKS=false
ENV VITE_USE_MOCKS=${VITE_USE_MOCKS}


RUN pnpm --filter mf-videos build


FROM nginx:stable-alpine AS runner

COPY apps/mf-videos/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/apps/mf-videos/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
