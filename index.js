const Discord = require('discord.js');
const botconfig = require('./botconfig.json');
const fs = require("fs");
const client = new Discord.Client();
client.commands = new Discord.Collection();

fs.readdir("./commands", (err, files) => {
    //this looks at ./commands/... for javascript files
    if(err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0) {
        console.log("Couldn't find commands.");
        return;
    }

    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded!`);
        client.commands.set(props.help.name, props)
        client.commands.set(props.help.name2, props)
    })

})


client.on('message', message =>{
    // Must-have if-statements
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    //
    // Must-have let variables
    let prefix = "~"; //You can define prefix here too.
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1); //(34-36) defines args.
    //

    if(message.content.startsWith(prefix)) {
        try {
        let commandfile = client.commands.get(cmd.slice(prefix.length));
        if(commandfile) commandfile.run(client,message,args);
        
           }  catch (e) {
               console.log(e);
           }
    };
});


client.on('ready', () => {
    console.log(`We Have Successfully loaded The Bot`);
    client.user.setPresence({game:{name:`QuartexNetwork`,type:`PLAYING`}})

 });

client.login(botconfig.token);