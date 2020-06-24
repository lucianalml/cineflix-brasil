# cineflix-brasil

## Pré requisitos
Instalar npm versão 8.11.2

Instalar ionic usando npm
```sh
$ npm install -g cordova ionic
```

Baixar o repositório git, entrar na pasta e instalar pacotes:
```sh
$ npm install
```

Executar em localhost
```sh
$ ionic serve
```

## Gerando aplicativo

Instalar pré requisitos Java JDK, Android Studio, Atualizar Android SDK tools, platform and component dependencies (SDK Manager) 

### Documentação  

https://ionicframework.com/docs/intro/deploying/
https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html

Setar as variaveis de ambiente JAVA_HOME, ANDROID_HOME

### Rodando o aplicativo no celular
Habilitar depuração USB
Habilitar modo desenvolvedor

```sh
$ ionic cordova run android --device
```

### Publicando no google play

https://ionicframework.com/docs/v1/guide/publishing.html

No config.xml alterar o número da versão

Fazer o build da release

```sh
$ ionic cordova build --release android
```

Gerar assinatura

```sh
$ keytool -genkey -v -keystore my-release-key.keystore -alias cineflix_key -keyalg RSA -keysize 2048 -validity 10000
```

Assinar o aplicativo

```sh
$ jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk cineflix_key

$ ~/Library/Android/sdk/build-tools/19.1.0/zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk CineflixBrasil.apk 
```








