добро пожаловать, и спасибо, что пользуетесь продукцией СГИХНЮ ©!

прежде всего, для использования этого ПО необходимы ключи, которые запрашиваются у нас.

во-вторых, нужно установить Node.js (nodejs.org) версии 12+

также, имя пользователя не должно содержать не латинских (английских) букв. 

если оно их содержит, то переместите папку с программой в директорию без запрещённых символов (например, диск D:\) и запускайте её оттуда.

запускать ПО можно через .bat файл.

в файле config.json содержаться конфигурации и инструкции к ним.

в файле anekdot.json содержаться анекдоты, доступные для команды "anekdot". в текущей версии их количество изменять нельзя, но можно изменять сами анекдоты. последний элемент массива должен оставаться пустым.

если возникают проблемы с запуском попробуйте:
1. открыть командную строку (windows)
2. ввести "cd /d полный_путь_к_папке_бота" (например "cd /d D:\bot_для_отправки)
3. ввести "npm init"
4. после окончания установки npm последовательно установить следующие библиотеки (npm install название):
discord.js
ytdl-core
ytdl-core-discord
ffmpeg
ffmpeg-binaries
5. если ПО всё ещё не работает корректно, свяжитесь с нами
