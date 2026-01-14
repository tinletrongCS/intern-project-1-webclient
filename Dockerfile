
FROM node:16-alpine as build
WORKDIR /tmp
COPY package.json /tmp/
ENV NODE_ENV=development
RUN npm install
COPY . /tmp/
ENV NODE_ENV=production

# 👉 Thêm dòng này để tăng heap memory
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

FROM nginx:alpine
COPY --from=build /tmp/dist /usr/share/nginx/html
COPY --from=build /tmp/static /usr/share/nginx/html/static
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
