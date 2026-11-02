FROM node:24-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@10.34.9


COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm --filter mf-drawer build


FROM nginx:stable-alpine AS runner

COPY apps/mf-drawer/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/apps/mf-drawer/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
