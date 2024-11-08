Для сборки собственного контейнера необходимо выполнить: 

```bash
git clone https://github.com/iposho/holidays-calendar-ru.git app
mv ./Docker/Dockerfile ./Dockerfile
docker build . -t holidays-calendar:0.1
docker run -p 5000:5000 holidays-calendar:0.1
```

Или для использования контейнера из репозитория: 
```bash
docker run -p 5000:5000 iteterin/holidays-calendar:0.1 
#С API YANDEX METRIKA
docker run -p 5000:5000 -e YANDEX_METRIKA_ID=XXX-XXX-XXX iteterin/holidays-calendar:0.1
```
