const Discord = require('discord.js');
const botconfig = require('./botconfig.json');
const fs = require("fs");
const client = new Discord.Client();
client.commands = new Discord.Collection();


const activities_list = [
    "WorldCloud Closed Beta.", 
    "Prefix: .",
    "Help: .help", 
    "WorldCloud Coming Soon"
    ]; // creates an arraylist containing phrases you want your bot to switch through.

client.on('ready', () => {
    setInterval(() => {
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1); // generates a random number between 1 and the length of the activities array list (in this case 5).
        client.user.setActivity(activities_list[index]); // sets bot's activities to one of the phrases in the arraylist.
    }, 10000); // Runs this every 10 seconds.
});

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
