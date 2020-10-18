# Building Applications

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

## Android

* Navigate to the application root directory, commands are relative from there, unless specified otherwise.
* Find and navigate to your JDK directory using `/usr/libexec/java_home`.
* Generate a private signing key using `keytool`:

```bash
sudo keytool -genkey -v -keystore cerebral-cereal.keystore -alias cerebral-cereal-key -keyalg RSA -keysize 2048 -validity 10000
```

* Follow instructions and set password and signing information and make a secure note of the password, e.g.

| Field | Value           |
| ----- | --------------- |
| CN    | Nesh Patel      |
| OU    | Developer       |
| O     | Cerebral Cereal |
| L     | London          |
| ST    | Greater London  |
| C     | UK              |

* Move `cerebral-cereal.keystore` to `android/app` in your application directory.
* Open [Keychain Access](https://support.apple.com/en-gb/guide/keychain-access/kyca1083/mac) and
  create a new entry called `cerebral_cereal_keystore` with the keystore password.
* In the terminal, test this password by running:

```bash
security find-generic-password -s cerebral_cereal_keystore -w
```

* Add the following to `android/gradle.properties`:

```ini
# Release keystore settings
KEYSTORE_FILE=cerebral-cereal.keystore
KEY_ALIAS=cerebral-cereal-key
KEYCHAIN=cerebral_cereal_keystore
```

* Add the following to the top of `android/app/build.gradle`:

```groovy
def getPassword(String keyChain) {
    def stdout = new ByteArrayOutputStream()
    def stderr = new ByteArrayOutputStream()
    def currentUser = System.getProperty("user.name")
    exec {
        commandLine 'security', '-q', 'find-generic-password', '-a', currentUser, '-s', keyChain, '-w'
        standardOutput = stdout
        errorOutput = stderr
        ignoreExitValue true
    }
    //noinspection GroovyAssignabilityCheck
    stdout.toString().trim()
}
```

* Further down in the file, at the android signing configs, update the parameters
  to point to your keystore and passwords:


```groovy
// Fetch passwords from the local Keychain
def pass = getPassword(KEYCHAIN)

android {
  ...
  signingConfigs {
      debug {
          storeFile file(KEYSTORE_FILE)
          storePassword pass
          keyAlias KEY_ALIAS
          keyPassword pass
      }
  }
  ...
}
```

* Finally setting the following to variable to `true` will significantly reduce APK size upon build:

  * `def enableSeparateBuildPerCPUArchitecture = true`

* Build the application on your Mac:

```bash
cd android
./gradlew bundleRelease
```

* This creates an [App Bundle](https://developer.android.com/guide/app-bundle) (`.aab` file).
  This can be sent to the [Google Play Store](https://play.google.com/store?hl=en) for publishing.
  The Play Store will be in charge of distributing and extracting the specific APK and should be
  more efficient and compact than if done manually.

### Convert App Bundle to APK

* Install the [BundleTool](https://github.com/google/bundletool): `brew install bundletool`
* Use the following to extract the APK from the AAB:

```bash
bundletool build-apks --bundle=./android/app/build/outputs/bundle/release/app-release.aab --output=./android/app/build/outputs/apk/release/app.apks
```

### Build APK instead of AAB

This builds the old APK format directly

```bash
cd android
./gradlew assembleRelease
```