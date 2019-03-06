# 🎸 BackTracks Engine ![Heroku](https://heroku-badge.herokuapp.com/?app=backtracks-engine) [![Live at](https://img.shields.io/badge/live%20at-backtracks--engine.herokuapp.com-blueviolet.svg?style=plastic)](https://backtracks-engine.herokuapp.com/)

**If you think something is broken, something is missing or have any questions, please open an [Issue](https://github.com/Zaliro/backtracks-engine/issues)**.

---

## 👋 Introduction

_BackTracks Engine_ is a __tool aimed at managing of backing tracks__ or « backtracks ».

_The following is a list of the main features implemented :_
- __Persistent environment__
- __Mobile authentication__
- __Search__
- __Favorites__
- __Playlists__
- __Comments__

---

## 🚀 Getting Started

#### 1. Clone and Install

```bash
# Clone the repo
git clone https://github.com/Zaliro/backtracks-engine.git

# Install dependencies
yarn install
```

#### 2.1. Development

```bash
# Starts are local live-reload server at:
# http://localhost:3001
yarn dev
```

Via webpack, starts a localhost server on port 3001 : [http://localhost:3001](http://localhost:3001)

- Save code and it auto refreshes.

#### 2.2. Production

```bash
# Bundle app
# Start an express server to expose our packed app at:
# http://localhost:8080
yarn heroku-prebuild
yarn start
```

Via webpack, starts a localhost server on port 8080 : [http://localhost:8080](http://localhost:8080)<br/>

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/Zaliro/backtracks-engine)<br/>
_Note that you can deploy this repos __(or a fork)__ directly to [Heroku](https://heroku.com)._


---

## 💡 Inspiration

- [React Native Starter Kit](https://github.com/mcnamee/react-native-starter-kit)
