<h2 align="center">Baileys SelfBot</h2>
<p align="center">Use At Your Own Risk</p>

# Begin
## What this bot needed
### Ubuntu&Termux
1. `ffmpeg`, `libwebp`, `nodejs`, `git`
2. install all needed
```bash
# Termux, make sure ffmpeg version is 4.x
pkg update && pkg upgrade
pkg install ffmpeg libwebp nodejs git -y

# change directory to 'selfbot'
git clone https://github.com/BotWAIndo/selfbot-baileys.git 'selfbot'
cd selfbot

# install npm package
npm install

# run
npm start
```

<br />

```bash
# Ubuntu, make sure ffmpeg version is 4.x
apt-get update
apt-get install ffmpeg nodejs libwebp git -y
 
 # change directory
 git clone https://github.com/BotWAIndo/selfbot-baileys.git 'selfbot'
 cd selfbot

 # install npm package
 npm install

 # run
 npm start
```

### Windows
1. `ffmpeg`, `libwebp`, `nodejs`, `git`
   - [ffmpeg](https://ffmpeg.org)
   - [nodejs](https://nodejs.org)
   - [libwebp](https://developers.google.com/speed/webp/download)
   - [git](https://git-scm.com)

2. path ffmpeg and libwebp
   - download ffmpeg and libwebp
   - extract to directory `C:\`
   - rename the extracted folder name of ffmpeg to `ffmpeg` and rename the extracted folder name of libwebp to `libwebp`
   - run cmd as administrator, then execute following command:
```bash
setx /m PATH "C:\libwebp\bin;%PATH%"
setx /m PATH "C:\ffmpeg\bini;%PATH%"

# if all command succes, the output is: 'SUCCESS: spesified value was saved'
```

3. cloning, install npm package and run
```bash
git clone https://github.com/BotWAIndo/selfbot-baileys.git 'selfbot'
cd selfbot
npm install
npm start
```

## Thanks
- [adiwajshing](https://github.com/adiwajshing) `baileys creator/author`
    - [Baileys](https://github.com/adiwajshing/Baileys)
