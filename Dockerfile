FROM node:23-alpine3.19
LABEL maintainer="ilya@teterin.spb.ru" 
LABEL org.opencontainers.image.description "Контейниризация приложения holidays-calendar-ru"
LABEL org.opencontainers.image.url "https://calendar.kuzyak.in/"
LABEL org.opencontainers.image.source "https://github.com/iposho/holidays-calendar-ru"
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm i
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]
HEALTHCHECK --interval=5m --timeout=10s CMD curl -f http://localhost:5000/ || exit 1
