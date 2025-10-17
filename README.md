# Portfolio Website

A modern, dynamic portfolio website with animated background and Discord integration.

## Features

- 🎨 Animated starfield background
- 🎮 Real-time Discord status integration
- 📱 Responsive design
- ⚙️ Dynamic tabs from config.json
- 🚀 Easy deployment to Railway

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open http://localhost:8000

## Configuration

Edit `config.json` to customize:
- Personal information
- Discord ID for status integration
- Tabs and content
- Spotify integration (optional)

## Deployment

This project is configured for Railway deployment. Simply connect your GitHub repository to Railway and it will automatically deploy.

## Tab Types

- `profile`: Shows name, description, and Discord profile
- `text`: Shows custom content with title and description

Add new tabs by editing the `tabs` array in `config.json`.
