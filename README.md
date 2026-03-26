# 🌊 FloodGuard

A real-time flood monitoring and alert system built with Angular. Track precipitation levels and receive alerts when thresholds are exceeded.

## 🚀 Quick Start

### What You Need
- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- A code editor like **VS Code**

### Installation

1. **Clone or download this project**
   ```bash
   cd flood-guard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   ng serve
   ```

4. **Open your browser**
   - Go to `http://localhost:4200/`
   - The app will automatically reload when you save changes

## 📁 Project Structure

```
flood-guard/
├── src/
│   ├── app/           # Your Angular components and services
│   ├── assets/        # Images, icons, and static files
│   └── styles.css     # Global styles
├── angular.json       # Angular configuration
├── package.json       # Project dependencies
└── README.md          # This file
```

## 🛠️ Common Commands

| Command | What it does |
|---------|-------------|
| `ng serve` | Starts development server at localhost:4200 |
| `ng generate component name` | Creates a new component |
| `ng build` | Builds the app for production |
| `ng test` | Runs unit tests |

## 🎨 Features

- **Alert Threshold Settings** - Set precipitation limits for alerts
- **Real-time Monitoring** - Track current precipitation levels
- **Alert History** - View past alerts with severity levels
- **City-based Tracking** - Monitor multiple locations

## 📚 Learning Resources

- [Angular Official Docs](https://angular.dev/)
- [Angular CLI Commands](https://angular.dev/tools/cli)
- [TypeScript Basics](https://www.typescriptlang.org/docs/)

## 🐛 Troubleshooting

**Port already in use?**
```bash
ng serve --port 4300
```

**Dependencies not installing?**
```bash
npm cache clean --force
npm install
```

## 📝 Notes

- Built with Angular CLI version 20.3.13
- Production builds are stored in `dist/` folder
- Changes auto-reload in development mode

---

**Need help?** Check the [Angular CLI documentation](https://angular.dev/tools/cli) or open an issue.
