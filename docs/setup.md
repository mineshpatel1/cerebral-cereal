# Setup Instructions

## Environment

| App            | Version                        |
| -------------- | ------------------------------ |
| Date           | 2020-08-15                     |
| OS             | Mac OSX 10.14.6                |
| Test Device    | Android Virtual Device v10 (Q) |
| Node           | 14.8.0                         |
| Watchman       | 20200806.030014                |
| JDK            | 1.8.0_265-b01                  |
| Android Studio | 4.0.1                          |

## Prerequisites

[Official Documentation](https://reactnative.dev/docs/environment-setup)

### NVM

Recommended to use [NVM](https://github.com/nvm-sh/nvm) to avoid [permission errors](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally) on Mac OSX.

[Guide](https://nodesource.com/blog/installing-node-js-tutorial-using-nvm-on-mac-os-x-and-ubuntu/)

* `xcode-select --install` -> Click install.
* `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash`

Add the following to `.bash_profile`:

```bash
export NVM_DIR="/Users/neshpatel/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm
```

* Run `nvm --version` to check your installation.

### Node

* Run `nvm ls-remote` to check all available Node versions.
* Find the latest stable version, and install: `nvm install 12.18.3`.
* Verify installation with `node -v`, `npm -v` and `npx -v`.


### File not found when using `sudo npm`


Sometimes have issues running `npm` with `sudo`:

```bash
sudo npm --version
env: node: No such file or directory
```

For some reason the NPM symlink isn't resolving when run as `sudo`. The easiest
workaround is to call `npm` explicitly:

```bash
sudo node "$NVM_DIR/versions/node/$(nvm version)/bin/npm" --version
6.14.8
```


### Homebrew Packages

```bash
brew install watchman
brew cask install adoptopenjdk/openjdk/adoptopenjdk8
```

### Create React Native App

```bash
npx react-native init <AppName>
```

Create `react-native.config.js` in the `AppName` directory with the following boilerplate:

```js
module.exports = {
  
}
```

### Android Pre-requisites

* Download and install [Android Studio](https://developer.android.com/studio/index.html).
* **Configure > SDK Manager**.
* **Appearance & Behavior > System Settings > Android SDK**.
* Select **Android 10.0 (Q)**.
* Click **Apply** to install.
* Open `./<AppName>/android` in Android Studio.
* **Tools > AVD Manager**.
* Create a virtual device with **API 29 (Q)** and run it.

### iOS Pre-requisites

* Download and install [XCode](https://developer.apple.com/xcode/).
* Install Ruby:

```bash
curl -L https://get.rvm.io | bash -s stable

# Restart terminal

rvm install ruby-2.6
rvm use ruby-2.6.5
rvm --default use 2.6.5
```

* [Install Cocoapods](https://www.programmersought.com/article/53084572438/):

```bash
sudo xcode-select --install
sudo xcodebuild -license accept
sudo xcode-select --switch /Library/Developer/CommandLineTools
sudo gem install cocoapods
```

* Install Pod file:

```bash
cd ./<AppName>/ios
sudo xcode-select --switch /Applications/Xcode.app
pod install
```


### Environment Variables

Add the following to `.bash_profile`:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

## React Native App

All application commands assume you are in the `./<AppName>` directory.

### React Native Metro Server

* In one terminal, run `npx react-native start`.

### Run on Android

* Start the Android emulator from Android Studio using the virtual device you created earlier.
* In a new terminal, run `npx react-native run-android`.
* To test on a physical device, follow this [guide](https://reactnative.dev/docs/running-on-device).

Note that it is generally recommended not to use Chrome DevTool debugging, as it will render all JavaScript processing extremely slow. This is especially harsh when testing animations. However if you really want to try it, run `adb shell input keyevent 82`. Then debugging will be available using Chrome DevTools at [http://localhost:8081/debugger-ui/](http://localhost:8081/debugger-ui/).


### Run on iOS

* In a new terminal, run `npx react-native run-ios`.


## Using Local Dependencies with `lsyncd`

We use [NPM](https://www.npmjs.com/) to manage external dependencies and their versions
but it can also be used to share components across applications in the repository. The
`./Common` directory contains a library of components to be used across applications
called `cerebral-cereal-common`.

By default NPM creates symlinks when installing local dependencies. This is usually great
as it means you don't have to keep re-installing packages when developing shared
components and testing them in one of your applications. However React Native cannot 
read linked folders when building the app, so we need to be a little inventive.

* Install a new version of rsync: `brew install rsync`
* Install the local package: `npm install ../Common --save`.
* Remove the symlink node module files: `rm -r node_modules/cerebral-cereal-common`.

### Build

This copies the files once and will be used next time you run your React Native app.
Changes in the common directory will not be reflected.

```bash
rsync -r --exclude 'node_modules' ../Common/ node_modules/cerebral-cereal-common/
```

### Development

The shell script `sync_dirs.sh` will loop and automatically keep the `Common` directory
in sync with its counterpart in `node_modules`. It is written to check every 5 seconds
and only run a sync if differences are detected. Remember to kill the process when you are
not using it. It is configured so it can run for each app in Cerebral Cereal, if adding 
a new app, just include it in the variables specified at the top of the file.

## Uninstall

### Node

[Guide](https://stackoverflow.com/questions/11177954/how-do-i-completely-uninstall-node-js-and-reinstall-from-beginning-mac-os-x)

* `brew uninstall node`  If files and directories cannot be removed, use `sudo` to manually remove them.
* `cd /usr/local/lib`
* `rm -r node*`  (You may need to run this as `sudo`).
* `cd /usr/local/include`
* `rm -r node*`
* `cd /usr/local/bin`
* `sudo rm npx`
* `sudo rm npm`
* `sudo rm react*`
* `sudo rm expo*`
* `sudo rm create-react-native-app`

