# Phaser React Game

## Live Demo

[Play the Game](https://curious-meringue-0769c3.netlify.app/)

## Overview

This project is a simple Phaser 3 game built using React. The game is initialized and displayed inside a React component, with a start button that hides when the game begins and reappears when the game ends.

## Features

- Built with **React** and **Phaser 3**.
- **Start Game** button that hides when the game starts and reappears upon game over.
- **Game Elements**: Player movement, collectible items, obstacles, and scoring system.
- **Responsive Design**: The game adjusts to viewport changes.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (>= 14.x)
- npm or yarn

### Installation

```sh
git clone <repo-url>
cd <project-folder>
npm install  # or yarn install
npm run dev  # or yarn dev
```

Then open [http://localhost:5173](http://localhost:5173) (or your Vite server address) in your browser.

## Game Setup

### Step 1: Create a React App

The game is integrated into a React app following the guide:\
[Phaser Game Setup](https://phaser.io/tutorials/create-game-app)

### Step 2: Implement the Phaser Game

The full game is created using Phaser 3 inside the React app following this guide:\
[Phaser Game Development](https://phaser.io/tutorials/making-your-first-phaser-3-game/part1)

### Step 3: Add Start Button

A start button is included to trigger the game. When the game starts, the button hides, and when the game ends, it reappears.

### Step 4: Button Configuration

The button styles are managed using a config file (`button-config.js`). The configuration is as follows:

```js
export const buttonConfig = {
  buttonText: "Start Game",
  buttonStyle: {
    color: "#FFFFFF",
    backgroundColor: "#A953FF",
    top: "75%",
    left: "50%",
    width: "70%",
    height: "48px",
    borderRadius: "8px",
    fontSize: "24px",
    position: "absolute",
    transform: "translateX(-50%)",
  },
};
```

## Project Structure

```
/your-project-folder
├── src/
│   ├── game/
│   │   ├── GameScene.jsx  # Main Phaser game logic
│   │   ├── config/
│   │   │   ├── button-config.js  # Button styling config
│   │   │   ├── GameButton.jsx  # Start button component
│   ├── App.jsx
│   ├── main.jsx
├── public/
│   ├── assets/  # Game assets (images, sprites, etc.)
├── package.json
├── README.md
```

## Deployment

This project is deployed on **Netlify**. To deploy manually:

```sh
npm run build  # or yarn build
```

Then deploy the `dist` folder to Netlify or any static hosting service.



Made with ❤️ using Phaser and React.

