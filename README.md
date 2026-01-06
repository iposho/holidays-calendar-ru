# 🇷🇺 Производственный календарь РФ API

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/iposho/holidays-calendar-ru)
![Uptimerobot](https://img.shields.io/uptimerobot/ratio/7/m797301234-a06cf748375429b73d2bee31)
![Vercel](https://vercelbadge.vercel.app/api/iposho/holidays-calendar-ru?style=flat)
![GitHub Size](https://img.shields.io/github/languages/code-size/iposho/holidays-calendar-ru)
![Last Commit](https://img.shields.io/github/last-commit/iposho/holidays-calendar-ru)
![MIT LICENSE](https://img.shields.io/github/license/iposho/holidays-calendar-ru)
[![Build and Push Docker Image](https://github.com/iteterin/holidays-calendar-ru/actions/workflows/docker-publish.yml/badge.svg?branch=main)](https://github.com/iteterin/holidays-calendar-ru/actions/workflows/docker-publish.yml)

📅 API для получения производственных календарей РФ (2023–2026) в формате JSON.

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

## 👨‍💻 Разработка

### Первый запуск
После клонирования репозитория статические API файлы будут автоматически сгенерированы при первом запуске:

```bash
git clone https://github.com/iposho/holidays-calendar-ru.git
cd holidays-calendar-ru
npm install
npm run dev  # Автоматически сгенерирует статические файлы и запустит dev сервер
```

### Работа с API
Все API endpoints обслуживаются статическими JSON файлами в папке `public/static-api/`. При изменении данных календаря:

```bash
npm run generate-api  # Перегенерировать статические файлы
```

### Структура проекта
- `src/data/` - исходные данные календаря (праздники, сокращенные дни)
- `scripts/generate-static-api.js` - генератор статических API файлов
- `public/static-api/` - сгенерированные статические файлы (игнорируются в Git)

---

## 🚀 Быстрый старт

### Использование API

API поддерживает различные форматы путей для максимальной совместимости:

```bash
# Год
curl "https://calendar.kuzyak.in/api/calendar/2023"

# Месяц (поддерживаются оба формата)
curl "https://calendar.kuzyak.in/api/calendar/2023/01"    # zero-padded
curl "https://calendar.kuzyak.in/api/calendar/2023/1"     # non-padded

# День (поддерживаются все комбинации)
curl "https://calendar.kuzyak.in/api/calendar/2023/01/05" # zero-padded
curl "https://calendar.kuzyak.in/api/calendar/2023/1/5"   # non-padded
curl "https://calendar.kuzyak.in/api/calendar/2023/01/5"   # mixed

# Праздники года
curl "https://calendar.kuzyak.in/api/calendar/2023/holidays"
```

### Обработка ошибок

API возвращает структурированные JSON ошибки для невалидных запросов:

```bash
# Невалидный год
curl "https://calendar.kuzyak.in/api/calendar/1999"
# {"error":"Invalid year","status":422}

# Невалидный месяц
curl "https://calendar.kuzyak.in/api/calendar/2023/13"
# {"error":"Invalid month","status":422}

# Невалидный день
curl "https://calendar.kuzyak.in/api/calendar/2023/01/40"
# {"error":"Invalid day","status":422}

# Несуществующий день (29 февраля в невисокосном году)
curl "https://calendar.kuzyak.in/api/calendar/2023/02/29"
# {"error":"Invalid day","status":422}
```

**Коды ошибок:**
- `422` - Невалидные параметры (год, месяц, день)
- `404` - Ресурс не найден
- `400` - Неизвестная ошибка

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
- **Статические endpoints**: API endpoints теперь обслуживаются статическими JSON файлами для максимальной производительности.
- **Автоматическая генерация**: Статические файлы генерируются автоматически при сборке проекта.
- **Долгосрочное кеширование**: Оптимизированные заголовки кеширования для CDN.

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

## ⚡ Производительность

### Статические endpoints
Все API endpoints теперь обслуживаются статическими JSON файлами, что обеспечивает:

- **Мгновенную загрузку**: Статические файлы загружаются без серверных вычислений
- **Оптимальное кеширование**: Умная стратегия кеширования с ETag для баланса производительности и актуальности данных
- **CDN-дружественность**: Легкое развертывание через CDN для глобальной доступности
- **Надежность**: Нет зависимости от серверных ресурсов для API

### Автоматическая генерация
Статические файлы генерируются автоматически при разработке и сборке проекта:

```bash
npm run dev     # Автоматически генерирует статические файлы перед запуском dev сервера
npm run build   # Автоматически генерирует статические файлы перед сборкой
npm run generate-api  # Ручная генерация статических файлов
```

### Стратегия кеширования
Оптимизированная стратегия кеширования для API endpoints:

- **CDN кеширование**: `s-maxage=31536000` (1 год) - долгосрочное кеширование в CDN для максимальной производительности
- **ETag валидация**: Динамические ETag на основе версии и даты сборки для проверки обновлений
- **Условные запросы**: Клиенты проверяют актуальность через `If-None-Match` заголовки, получая 304 Not Modified при отсутствии изменений

**Преимущества:**
- CDN обеспечивает быструю доставку данных по всему миру
- Клиенты всегда получают актуальные данные через условные запросы
- Минимальный трафик при отсутствии изменений (304 ответы)
- Максимальная производительность при наличии изменений

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
