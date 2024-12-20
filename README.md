# 🇷🇺 Производственный календарь РФ

![Uptimerobot](https://img.shields.io/uptimerobot/ratio/7/m797301234-a06cf748375429b73d2bee31)
![Vercel](https://vercelbadge.vercel.app/api/iposho/holidays-calendar-ru?style=flat)
![GitHub Size](https://img.shields.io/github/languages/code-size/iposho/holidays-calendar-ru)
![Last Commit](https://img.shields.io/github/last-commit/iposho/holidays-calendar-ru)
![MIT LICENSE](https://img.shields.io/github/license/iposho/holidays-calendar-ru)
[![Build and Push Docker Image](https://github.com/iteterin/holidays-calendar-ru/actions/workflows/docker-publish.yml/badge.svg?branch=main)](https://github.com/iteterin/holidays-calendar-ru/actions/workflows/docker-publish.yml)

📅 API для получения производственных календарей РФ (2023–2025) в формате JSON.

🔗 Быстрое, простое и удобное REST API для разработчиков.

![Календарь](public/opengraph-image.png)

---

## 📚 Содержание

- [🚀 Быстрый старт](#-быстрый-старт)
- [✨ Особенности проекта](#-особенности-проекта)
- [📌 Как получить данные](#-как-получить-данные)
- [🔧 Swagger-документация](#-swagger-документация)
- [🔧 Примеры использования](#-примеры-использования)
- [🧪 Тестирование](#-тестирование)
- [🤝 Как внести вклад](#-как-внести-вклад)
- [📄 Лицензия](#-лицензия)

---

## 🚀 Быстрый старт

### Использование API

```bash
curl -H "Content-Type:application/json" -X GET "https://calendar.kuzyak.in/api/calendar/2023"
```

### Локальный запуск

```bash
git clone https://github.com/iposho/holidays-calendar-ru.git
cd holidays-calendar-ru
npm install
npm run dev
```

### Docker

```bash
cp .env.example .env 
docker build . -t holidays-calendar
docker run -p 5000:5000 holidays-calendar
```

---

## ✨ Особенности проекта

- **Простой REST API**: Данные в формате JSON для легкой интеграции.
- **Гибкость**: Запросы на день, месяц или весь год.
- **Swagger-документация**: Удобный интерфейс для просмотра эндпоинтов и тестирования.
- **Docker**: Быстрое развертывание в контейнере.
- **Локальное развертывание**: Минимальные требования для запуска API.

---

## 📌 Как получить данные

### 📆 Список доступных календарей
```http
GET /api/calendar
```

### 📅 Календарь на год
```http
GET /api/calendar/{year}
```

### 🎉 Праздничные и сокращенные дни
```http
GET /api/calendar/{year}/holidays
```

### 📆 Календарь на месяц
```http
GET /api/calendar/{year}/{month}
```

### 📅 Информация о конкретном дне
```http
GET /api/calendar/{year}/{month}/{day}
```

---

## 🔧 Swagger-документация

Полная документация доступна по ссылке:  
[**Swagger UI**](https://calendar.kuzyak.in/swagger)

Вы можете использовать Swagger UI для тестирования и изучения всех доступных маршрутов и их параметров.

---

## 🔧 Примеры использования

### 🐍 Python
```python
import requests

response = requests.get("https://calendar.kuzyak.in/api/calendar/2024")
print(response.json())
```

### 📜 JavaScript
```javascript
fetch("https://calendar.kuzyak.in/api/calendar/2024")
  .then((res) => res.json())
  .then((data) => console.log(data));
```

### 🐘 PHP
```php
<?php
$response = file_get_contents("https://calendar.kuzyak.in/api/calendar/2024");
$data = json_decode($response, true);
print_r($data);
?>
```

### 💻 Curl
```bash
curl -H "Content-Type:application/json" -X GET "https://calendar.kuzyak.in/api/calendar/2024"
```

---

## 🧪 Тестирование

1. Запуск тестов:
   ```bash
   npm test
   ```

2. Покрытие кода:
   ```bash
   npm run test:coverage
   ```

---

## 🤝 Как внести вклад

1. Форкните репозиторий: [Fork this repo](https://github.com/iposho/holidays-calendar-ru/fork)
2. Создайте ветку:
   ```bash
   git checkout -b my-feature
   ```
3. Добавьте изменения и тесты:
   ```bash
   git commit -m "feat: добавил новую фичу"
   ```
4. Запушьте изменения:
   ```bash
   git push origin my-feature
   ```
5. Создайте пулл-реквест в ветку `develop`.

---

## 📄 Лицензия

Этот проект распространяется под лицензией [MIT](LICENSE).
