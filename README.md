# DisplayTimer
Display a count up/down timer onto browser or OBS browser source with hotkey controls.

## About
A simply count up/down timer which make use of [[DisplayKeystroke](https://github.com/xxdocobxx/DisplayKeystroke)]("DisplayKeystroke") to send global hotkeys to the browser.

## Usage
 1. Run the application `KeystrokeServer.exe`.
 2. Open the `index.html` on the browser or the OBS browser source.
 3. If you have not set the client ip on the application, you will then receive a request connection from the browser to the application. Otherwise,  the application will auto approve any request from the client ip you have provided.
 4. press `Ctrl+1` to start the timer, `Alt+1` to reset the timer.

## Customize
 1. Open the `custom.html` on the browser.
 2. Tweak the settings on the page.
 3. Generate the `timer.html` file.
 4. Place the generated file into the same folder of this app.
 5. Run the application `KeystrokeServer.exe`.
 6. Open the generated file on the browser of the OBS browser source.
 7. If you have not set the client ip on the application, you will then receive a request connection from the browser to the application. Otherwise,  the application will auto approve any request from the client ip you have provided.
 8. If you have not set the hotkeys, it will use the default hotkey `Ctrl+1` to start the timer and `Alt+1` to reset the timer.