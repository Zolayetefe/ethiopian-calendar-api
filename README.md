# 📅 Ethiopian Calendar & Business Date API

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-green.svg)
![Express](https://img.shields.io/badge/express-4.18.2-red.svg)
![License](https://img.shields.io/badge/license-MIT-yellow.svg)
![Status](https://img.shields.io/badge/status-production--ready-brightgreen.svg)

**A Production-Ready REST API for Ethiopian Calendar Conversion, Holiday Management, and Business Date Calculations**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Error Handling](#-error-handling)
- [Use Cases](#-use-cases)
- [Performance](#-performance)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

The **Ethiopian Calendar & Business Date API** is a fast and accurate REST API that handles conversion between Gregorian and Ethiopian calendars, along with advanced features like holiday detection and business day calculations.

Built with **Node.js + Express**, it is suitable for banking, HR/payroll, government systems, event planning, and mobile applications in Ethiopia.

### Ethiopian Calendar Key Facts

- 13 months (12 months of 30 days + Pagume: 5 or 6 days)
- New Year starts on **September 11** (or 12 in Gregorian leap years)
- Approximately 7–8 years behind the Gregorian calendar

---

## ✨ Features

### Core Conversion

- Gregorian ↔ Ethiopian date conversion
- Today's date in both calendars
- Round-trip validation

### Calendar Features

- Month and Year calendar generation
- Day and week information
- Support for English & Amharic
- Pagume (13th month) validation
- Leap year handling

### Holiday Management

- All public holidays
- Religious holidays (Genna, Fasika, Timket, etc.)
- Holiday checker
- Upcoming holidays

### Business Date Features

- Check working day
- Next / Previous working day
- Working days between two dates
- Settlement date calculation (T+2, T+3, etc.)
- Fiscal year information

---

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 14
- npm

### Installation

```bash
git clone https://github.com/yourusername/ethiopian-calendar-api.git
cd ethiopian-calendar-api

npm install

# Start in production
npm start

# Start in development (with auto-reload)
npm run dev
API will be available at: http://localhost:3000
Environment Variables (.env)
envPORT=3000
NODE_ENV=development

📚 API Documentation
Base URL: http://localhost:3000/api
Main Endpoints
Conversion

GET /conversion/gregorian-to-ethiopian
GET /conversion/ethiopian-to-gregorian
GET /conversion/today

Calendar

GET /calendar/month-calendar
GET /calendar/year-calendar
GET /calendar/day-info
GET /calendar/week-info
GET /calendar/validate-pagume

Holidays

GET /holidays/all
GET /holidays/check
GET /holidays/upcoming
GET /holidays/religious

Business Dates

GET /business/check-working-day
GET /business/next-working-day
GET /business/previous-working-day
GET /business/working-days-between
GET /business/settlement-date
GET /business/fiscal-year

All responses follow this format:
JSON{
  "success": true,
  "data": { ... }
}

🧪 Testing
Bash# Run all tests
npm test

# Conversion tests only
npm run test:conversion

# Tests with coverage
npm run test:coverage

# Watch mode
npm run test:watch

📁 Project Structure
Bashethiopian-calendar-api/
├── src/
│   ├── services/
│   │   ├── dateConversionService.js
│   │   ├── ethiopianCalendarService.js
│   │   ├── holidayService.js
│   │   └── businessDateService.js
│   ├── data/
│   │   └── holidays.json
│   └── utils/
│       └── constants.js
├── tests/
│   └── conversion.test.js
├── server.js
├── package.json
├── .env
└── README.md


🎯 Use Cases

Financial & Banking Systems
HR & Payroll Systems
Government Applications
Event Planning
Ethiopian Calendar Mobile Apps
E-commerce Delivery Scheduling


🤝 Contributing
Contributions are welcome! Feel free to fork and submit pull requests.

📄 License
This project is licensed under the MIT License.


Built with ❤️ for the Ethiopian community
⭐ Star this repo if you find it useful!

```

Done! Just copy and save as README.md.
Would you like a shorter version or any changes?i need the file to donload✅ Here is the easiest way to download the README.md file:
Method 1: Quick Download (Recommended)

Copy the entire content below
Open Notepad (Windows) or TextEdit (Mac) or any code editor
Paste the content
Save the file as: README.md
→ Important: Choose "All Files" type, not .txt

Markdown# 📅 Ethiopian Calendar & Business Date API

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-green.svg)
![Express](https://img.shields.io/badge/express-4.18.2-red.svg)
![License](https://img.shields.io/badge/license-MIT-yellow.svg)
![Status](https://img.shields.io/badge/status-production--ready-brightgreen.svg)

**A Production-Ready REST API for Ethiopian Calendar Conversion, Holiday Management, and Business Date Calculations**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Error Handling](#-error-handling)
- [Use Cases](#-use-cases)
- [Performance](#-performance)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

The **Ethiopian Calendar & Business Date API** is a fast and accurate REST API that handles conversion between Gregorian and Ethiopian calendars, along with holiday management and business date calculations.

Built with **Node.js + Express**, perfect for banking, HR, government, and Ethiopian apps.

### Ethiopian Calendar Facts

- 13 months (12×30 + Pagume 5/6 days)
- New Year: September 11/12
- 7–8 years behind Gregorian

---

## ✨ Features

- Gregorian ↔ Ethiopian Conversion
- Month & Year Calendar
- Public & Religious Holidays
- Working Day Calculations
- Next/Previous Working Day
- Settlement Date (T+2, T+3...)
- Fiscal Year Support
- English & Amharic Support

---

## 🚀 Quick Start

```bash
git clone https://github.com/yourusername/ethiopian-calendar-api.git
cd ethiopian-calendar-api
npm install
npm run dev
API runs at: http://localhost:3000

📚 API Documentation
Base URL: http://localhost:3000/api
Main Groups:

/conversion/ → Date conversion
/calendar/ → Calendar features
/holidays/ → Holiday management
/business/ → Business date logic


🧪 Testing
Bashnpm test
npm run test:conversion
npm run test:coverage

📁 Project Structure
Bashethiopian-calendar-api/
├── src/services/          # Core logic
├── src/data/holidays.json
├── tests/
├── server.js
└── README.md

🔧 Error Handling

200 Success
400 Invalid Date / Parameters
500 Server Error


🎯 Use Cases

Financial Systems
HR & Payroll
Government Services
Event Planning
Mobile Calendar Apps


📈 Performance

Fast response (< 10ms)
Built-in caching
High performance


📄 License
MIT License


Built with ❤️ for the Ethiopian community

⭐ Star this repo if you find it useful!

```
