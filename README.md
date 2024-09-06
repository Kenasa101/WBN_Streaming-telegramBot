[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![Discord][discord-shield]][discord-url]
[![Docker Pulls][docker-shield]][docker-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Matt0550/Eurostreaming-telegramBot">
    <img src="https://raw.githubusercontent.com/Matt0550/public-gaac/main/uploads/eurostreaming_logo_telegram_bot.png" alt="Logo" height="40">
  </a>

  <h3 align="center">Eurostreaming Unofficial Telegram BOT & Mini App</h3>

  <p align="center">
    An unofficial Telegram BOT and Mini App for Eurostreaming website.
    <br />
    <br />
    <a href="https://github.com/Matt0550/Eurostreaming-telegramBot/issues">Report Bug</a>
    ·
    <a href="https://github.com/Matt0550/Eurostreaming-telegramBot/issues">Request Feature</a>
  </p>
</div>

All the data is scraped from the Eurostreaming website using my [own API](https://github.com/Matt0550/EurostreamingAPI-scraping) and is not affiliated with Eurostreaming in any way. This project is for educational purposes only. I do not condone piracy in any way. Please use this project responsibly.

Copyright and all rights belong to the respective owners.

## Bot Features (only with WebApp)

- View the latest TV shows
- Search for TV shows
- Get the details of a TV show
- Get the streaming links of a TV show episode


## Mini App Demo

https://github.com/user-attachments/assets/38c202f8-6bcc-4983-8847-cf5aaf0d9d2a

## TO-DO
- [ ] Notifications for new episodes
- [ ] Categories
- [ ] Docker support


## Public instance of the Bot
At the moment, I can't provide a public instance of the bot because scraping is not a good practice and it's not allowed by the Eurostreaming website. I don't want to get in trouble with them, so I can't provide a public instance of the bot. Sorry for the inconvenience.

## Environment Variables
| Variable | Description | Default |
| :--- | :--- | :--- |
| `token` | The Telegram Bot token | `None` |
| `owner_id` | The Telegram ID of the owner | `None` |
| `enable_webapp_server` | Enable the webapp server | `False` |
| `webserver_debug` | Enable the debug mode for the webapp server | `False` |
| `webapp_host` | The host of the mini app server | `0.0.0.0 or localhost (win)` |
| `webapp_port` | The port of the mini app server | `5000` |
| `report_errors_owner` | Report errors to the owner | `False` |
| `secret_key` | The secret key for the webapp server | `abc123` |
| `scraping_api_url` | The URL of the scraping API | `http://localhost:8000` |
| `PUID` | Docker PUID | `1000` |
| `PGID` | Docker PGID | `1000` |

## Installation - Using Docker Compose (recommended)
```yaml
version: '3'

services:
  eurostreaming_telegrambot:
    image: matt0550/eurostreaming_telegrambot
    environment:
      - token=TG_TOKEN
      - owner_id=TG_OWNER_ID
      - enable_webapp_server=True # For the telegram webapp.
      - webserver_debug=False
      - report_errors_owner=True # Report errors to the owner.
      - secret_key=abc123    # Random string
      - scraping_api_url=http://localhost:8000
      - PUID=1000     # UID of the user inside the container
      - PGID=1000     # GID of the user inside the container
    ports:
      - 7015:5000
    restart: unless-stopped
```

Run the container with `docker-compose up -d`

## Installation - Using Docker Run
```bash
docker run -d \
  --name=eurostreaming_telegrambot \
  -e token=TG_TOKEN \
  -e owner_id=TG_OWNER_ID \
  -e enable_webapp_server=True \
  -e webserver_debug=False \
  -e report_errors_owner=True \
  -e secret_key=abc123
  -e PUID=1000 \
  -e PGID=1000 \
  -p 7015:5000 \
  --restart unless-stopped \
  matt0550/eurostreaming_telegrambot
```

## Installation - Self-Host or docker build

Clone the project

```bash
  git clone https://github.com/Matt0550/Eurostreaming-telegramBot
```

Go to the project directory

```bash
  cd Eurostreaming-telegramBot-master
```

OPTIONAL: use docker to build the image

```bash
  docker build -t Eurostreaming-telegramBot .
```
If you don't want to use docker, skip this step.
Else, change the `image` in `docker-compose.yml` with the image name you used.
Run the container with `docker-compose up -d`

Install dependencies

```bash
  pip install -r requirements.txt
```

Start the REST API (after setting the environment variables)

```bash
  cd api
  python main.py
```

## Help - feedback
You can contact me on:

Discord: https://go.matteosillitti.it/discord

Telegram: https://go.matteosillitti.it/telegram

Mail: <a href="mailto:mail@matteosillitti.it">me@matteosillitti.it</a>

## License

[GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/)

## Support me

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/matt05)

[![buy-me-a-coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/Matt0550)

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://paypal.me/sillittimatteo)

[contributors-shield]: https://img.shields.io/github/contributors/Matt0550/Eurostreaming-telegramBot.svg?style=for-the-badge
[contributors-url]: https://github.com/Matt0550/Eurostreaming-telegramBot/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Matt0550/Eurostreaming-telegramBot.svg?style=for-the-badge
[forks-url]: https://github.com/Matt0550/Eurostreaming-telegramBot/network/members
[stars-shield]: https://img.shields.io/github/stars/Matt0550/Eurostreaming-telegramBot.svg?style=for-the-badge
[stars-url]: https://github.com/Matt0550/Eurostreaming-telegramBot/stargazers
[issues-shield]: https://img.shields.io/github/issues/Matt0550/Eurostreaming-telegramBot.svg?style=for-the-badge
[issues-url]: https://github.com/Matt0550/Eurostreaming-telegramBot/issues
[license-shield]: https://img.shields.io/github/license/Matt0550/Eurostreaming-telegramBot.svg?style=for-the-badge
[license-url]: https://github.com/Matt0550/Eurostreaming-telegramBot/blob/master/LICENSE
[discord-shield]: https://img.shields.io/discord/828990499507404820?style=for-the-badge
[discord-url]: https://go.matteosillitti.it/discord
[docker-shield]: https://img.shields.io/docker/pulls/matt0550/eurostreaming_telegrambot?style=for-the-badge
[docker-url]: https://hub.docker.com/r/matt0550/eurostreaming_telegrambot