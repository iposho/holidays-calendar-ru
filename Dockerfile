FROM node:23-alpine3.19
LABEL maintainer="ilya@teterin.spb.ru" 
WORKDIR /usr/src/app
COPY .package*.json ./
RUN npm i
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]
HEALTHCHECK --interval=5m --timeout=10s CMD curl -f http://localhost:5000/ || exit 1