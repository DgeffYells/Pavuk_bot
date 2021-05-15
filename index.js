const Discord = require("discord.js");
const { prefix, stat, typ } = require("./config.json");
const { token, ytkey} = require("./tokens.json");
const ytdl = require("ytdl-core");
const request = require("request");
const fs = require("fs");
const getYouTubeID = require("get-youtube-id");
const fetchVideoInfo = require("youtube-info");
const {anekdots} = require("./anekdot.json")
const client = new Discord.Client();
const queue = new Map();
client.once("ready", () => {
  console.log("Готов вкалывать!");
  client.user.setActivity(stat, {type: typ});
});

client.once("reconnecting", () => {
  console.log("Опять работать?");
});

client.once("disconnect", () => {
  console.log("Прощайте");
});

question =false;

client.on("message", async message => {
  if (message.channel.id == "703165753528156200"){
    client.channels.fetch("511905776718053376")
    .then(channel => {channel.send(message.content);
      console.log("Отправил сообщение на канал "+channel +" " + channel.name)})
    .catch(console.error)
    return;
  }

  if (message.author.bot) return;
  if (!message.guild) return;
  const low = message.content.toLowerCase();
  const chan = message.channel;
  const serverQueue = queue.get(message.guild.id);
  const nick = message.member.nickname;
  const usr = message.author;
  const gil = message.guild;
  doj = true; //всё ещё нужно, для предотвращения озвучивания спец. проигрываний (хаос и иже)
  if (message.content.startsWith(`Короче, Меченый, я тебя спас и в благородство играть не буду: выполнишь для меня пару заданий — и мы в расчете. Заодно посмотрим, как быстро у тебя башка после амнезии прояснится. А по твоей теме постараюсь разузнать. Хрен его знает, на кой ляд тебе этот Стрелок сдался, но я в чужие дела не лезу, хочешь убить, значит есть за что...`))
  {
    //Данная фича была нужна для удаления надоедливых сообщений другого бота о лвл апе. наверно, её можно удалить 8/
    doj = false;
    console.log(`Deleted Sidor LvlUP message (${usr.username})`)
    message.delete()
    .catch(console.error);
  } else if (question && low.endsWith("?") ){
    if (low.includes("ты пидор")){
      message.reply("а может ты пидор?")
    } else if (low.includes("пидор")){
      message.reply("да.")
    } else {
    var q = Math.round( Math.random()*10);
    if (q>5) message.reply("да.")
    else message.reply("нет.");
    }
    return
  }
  if (!message.content.startsWith(prefix)) return;

  if (low.startsWith(`${prefix}play`)) {
    if (low.includes("https://www.youtube.com/watch?v=")){
      console.log(`${usr.username} (${nick}) включил музыку на ${gil.name} через ссылку`);
      execute(message, serverQueue)
      .catch(console.error);
      return;

    } else if (low == "o/play") {
        message.reply("Что играть-то?");
    } else {
      console.log(`${usr.username} (${nick}) включил музыку на ${gil.name} через название`)
      executesear(message, serverQueue)
      .catch(console.error)
      return;

    }
  } else if (low.startsWith(`${prefix}skip`) || low.startsWith(`${prefix} skip`)) {
      console.log(`${usr.username} (${nick}) скипнул трек на ${gil.name}`);
      skip(message, serverQueue)
      return;

  } else if (low.startsWith(`${prefix}stop`)|| low.startsWith(`${prefix} stop`)) {
    console.log(`${usr.username} (${nick}) остановил воспроизведение музыки на ${gil.name}`)
    stop(message, serverQueue);
    return;

  } else if (low.startsWith(`${prefix}hello`)||low.startsWith(`${prefix} hello`)) {
    message.reply("Привет!");
    return;
 
  } else if (low.startsWith(`${prefix}anekdot`)||low.startsWith(`${prefix} anekdot`)) {
    console.log(`${usr.username} (${nick}) попросил рассказать анекдот на ${gil.name} на ${chan.name}`)
    var q = Math.round( Math.random()*10);
    chan.send("Внимание! Анекдот!\n"+anekdots[q]);
  }
   /*else if ( (message.content.includes("Unity",0)) || (message.content.includes("unity",0)) || (message.content.includes("Юнити",0)) || (message.content.includes("юнити",0))  ) {    
    message.delete();
    message.member.addRole(message.member.guild.roles.find("name" , "Жан-Клод Вам Бан"));
    
    message.reply("никто не в праве называть имя этого бесконечного источника бинарного кала!");
  } */
  // оставил только в качестве образца выдачи роли по ёё имени
  else if (low.startsWith(`${prefix}commands`)||low.startsWith(`${prefix}help`)||low.startsWith(`${prefix} help`)||low.startsWith(`${prefix} commands`)){
    console.log(`${usr.username} (${nick})  запросил список команд на ${gil.name} на ${chan.name}`)
    chan.send(`Префикс - \`${prefix}\`\n \`hello\` - привет!\n \`anekdot\` - Внимание! Анекдот!\n \`sidor\` - Хабар принес?\n \`play\` \`*URL или название*\`(Писать без пробела!(\`o/play music\`)) - воспроизведение музыки (а также добавление произведения в очередь)\n \`skip\`, \`stop\`, \`queue\` - думаю понятно :/\n \`chaos\` - Chaos! Chaos!\n \`avatar\` - получить ссылку на свою аватарку\n \`ask\` - познать истину (или ложь)\n \`fask\` - прекратить познавать истину (или ложь)`)
    chan.send(`${client.emojis.cache.get("696405977792118794")}`)

  } else if (low.startsWith(`${prefix}sidor`)||low.startsWith(`${prefix} sidor`)) {
    console.log(`${usr.username} (${nick}) used Sidor at ${gil.name} at ${chan.name}`);
    chan.send("Короче, " + (usr.toString()) + ", я тебя спас и в благородство играть не буду: выполнишь для меня пару заданий — и мы в расчете. Заодно посмотрим, как быстро у тебя башка после амнезии прояснится. А по твоей теме постараюсь разузнать. Хрен его знает, на кой ляд тебе этот Стрелок сдался, но я в чужие дела не лезу, хочешь убить, значит есть за что..." )

  } else if (low.startsWith(`${prefix}chaos`)||low.startsWith(`${prefix} chaos`)){
    console.log(`${usr.username} (${nick}) призвал Хаос на ${gil.name}`)
    if (!message.member.voice.channel){
      console.log("Но никто не пришёл...")
      return message.reply("Где должен воцариться Хаос?");
    }
    doj = false;
    executespec(message,serverQueue,"https://www.youtube.com/watch?v=uD3BuJk0lOQ");
    
  }
  else if (low.startsWith(`${prefix}`)&& equalizer(low).includes("wag")){ 
    if (!message.member.voice.channel) { return;}
    executespec(message,serverQueue,"https://www.youtube.com/watch?v=jt_9fsA_XmA");
   }
   else if (low.startsWith(`${prefix}avatar`)||low.startsWith(`${prefix} avatar`)){
    console.log(`${usr.username} (${nick}) запросил ссылку на свой аватар на ${gil.name} на ${chan.name}`);
    message.reply(message.author.avatarURL());
  } else if (low.startsWith(`${prefix}queue`)||low.startsWith(`${prefix} queue`)){
    console.log(`${usr.username} (${nick}) запросил очередь воспроизведения на ${gil.name}`);
    queueShow(message,serverQueue);
  } else if (low.startsWith(`${prefix}ask`||low.startsWith(`${prefix} ask`))){
    console.log(`${usr.username} (${nick}) начал задавать вопросы на ${gil.name}`);
    question = true;
    chan.send("Задавай свои вопросы, кожаный мешок с костями!")
  } else if (low.startsWith(`${prefix}`)&&low.includes("fask") ){
    question = false;
    console.log(`${usr.username} (${nick}) перестал задавать вопросы на ${gil.name}`);
  }
  else if (doj) {
    console.log(`${usr.username} (${nick}) ввёл некорректную команду на ${gil.name} на ${message.channel.name}`)
   message.reply(`Херню пишешь!\n\`${prefix}help\` для просмотра команд!`);
  }
});

function queueShow(message,serverQueue){
  if (!serverQueue){
    console.log("Но очередь была пустой");
     return message.reply("\nThe Sound of Silence")
  }
  var s="";
  serverQueue.songs.forEach(Element => {
    s=s+"\n"+Element.title;
  });
  message.reply(s);
}

async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel){
    console.log("Но был вне голосового канала")
    return message.channel.send("В голосовой зайди, пенчекряк!");}
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    console.log("Но у меня нет прав, чтобы эсто сделать")
    return message.channel.send("А права мне дать не хочешь?(подключаться, говорить)");
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url
  };
  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };




    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);
    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    console.log("Но она была занесена в очередь")
    return message.channel.send(`${song.title} занесена в красную книгу`);
  }
}

async function executespec(message, serverQueue,ur) {

  const voiceChannel = message.member.voice.channel;

  const songInfo = await ytdl.getInfo(ur);
  const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url
  };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };




    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    skip(message,serverQueue);}
}

async function executesear(message, serverQueue) {
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel){
    console.log("Но был вне голосового канала")
    return message.channel.send("В голосовой зайди, пенчекряк!");}
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    console.log("Но у меня нет прав, чтобы эсто сделать")
    return message.channel.send(
      "А права мне дать не хочешь?(подключаться, говорить)"
    );
  }
  const argus = message.content.split(' ').slice(1).join(" ");
  

   
    p = await getID(argus, async function(id){
      o="https://www.youtube.com/watch?v="+id ;

      const songInfo = await ytdl.getInfo(o);
      const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url
      };

      
   
      if (!serverQueue) {
        const queueContruct = {
          textChannel: message.channel,
          voiceChannel: voiceChannel,
          connection: null,
          songs: [],
          volume: 5,
          playing: true
        };

        queueContruct.songs.push(song);
        queue.set(message.guild.id, queueContruct);
    
    
    
        try {
          var connection = await voiceChannel.join();
          queueContruct.connection = connection;
          play(message.guild, queueContruct.songs[0]);
        } catch (err) {
          console.log(err);
          queue.delete(message.guild.id);
          return message.channel.send(err);
        }
      } else {
        serverQueue.songs.push(song);
        console.log("Но она была занесена в очередь")
        return message.channel.send(`${song.title} занесена в красную книгу`);
      }
    
    });

   
}

function getID(str, cb) {

      search_video(str, function(id) {
          cb(id);
          global.po = id;
      });
      return cb;
}


function search_video(query, callback) {
  
  request("https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=" + encodeURIComponent(query) + "&key=" + ytkey, function(error, response, body) {
      var json = JSON.parse(body);
      callback(json.items[0].id.videoId);
      

  });

}


function skip(message, serverQueue) {
  if (!message.member.voice.channel){
    console.log("Но был вне голосового канала");
    return message.channel.send(
      "Что бы скипнуть, для начала зайди в голосовой!"
    );}
  if (!serverQueue)
    return message.channel.send("А чё скипать?");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel){
    console.log("Но был вне голосового канала")
    return message.channel.send(
      "Что бы стопануть, для начала зайди в голосовой!"
    );}
    if (!serverQueue) return;
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  if (doj){
    console.log(`Запустил трек на ${guild.name}`);
    serverQueue.textChannel.send(`В эфире: *${song.title}*`);}
}

function equalizer (str){
    if (typeof(str)!="string") return "not string!"
    
    s =str[0];
    for (var i =1; i<= str.length;i++){
      if (str[i]!=str[i-1]) s=s+str[i];
    }
    return s;
  }

client.login(token);