# مرحلة الـ build
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build:ssr

# مرحلة التشغيل
FROM node:20-alpine

WORKDIR /app

# ننسخ الـ dist والـ package.json
COPY --from=build /app/dist ./dist
COPY package*.json ./

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

CMD ["node", "dist/al-motammem/server/main.js"]
