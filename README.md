# Futsal Coach Web

Бесплатное тренерское веб-приложение поверх Google Sheets Futsal Coach System.

## Архитектура

- React + TypeScript + Vite — интерфейс.
- Google Apps Script — бесплатный backend и hosting.
- Google Sheets — текущая база и расчётное ядро.
- GitHub Actions — проверка production-сборки.

## Уже реализовано

- Dashboard.
- Список игроков.
- Карточка игрока.
- Физический профиль F1–F6.
- Ввод физических тестов с минимальным количеством полей.
- Адаптивный интерфейс.
- Apps Script API для чтения игроков и рейтинга и записи физических тестов.
- Демо-режим при локальном запуске без Google Apps Script.

## Локальный запуск

1. npm install
2. npm run dev

## Production-сборка для Google Apps Script

1. npm install
2. npm run build:gas

Команда создаёт apps-script/Index.html, куда JS и CSS встроены внутрь одного HTML-файла.

## Первичная настройка Apps Script

1. Создай Apps Script-проект.
2. Скопируй apps-script/Code.gs.
3. После npm run build:gas скопируй apps-script/Index.html.
4. Один раз запусти setupSpreadsheet с ID таблицы.
5. Разверни проект как Web App.

Google Sheet не публикуется в браузер. Чтение и запись выполняет Apps Script.

## Следующие модули

Техника, тактика, матчи, посещаемость, составы и прогресс.
