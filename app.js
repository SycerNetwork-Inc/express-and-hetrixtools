console.clear()
console.log(`
███████╗██╗   ██╗ ██████╗███████╗██████╗ ███╗   ██╗███████╗████████╗██╗    ██╗ ██████╗ ██████╗ ██╗  ██╗
██╔════╝╚██╗ ██╔╝██╔════╝██╔════╝██╔══██╗████╗  ██║██╔════╝╚══██╔══╝██║    ██║██╔═══██╗██╔══██╗██║ ██╔╝
███████╗ ╚████╔╝ ██║     █████╗  ██████╔╝██╔██╗ ██║█████╗     ██║   ██║ █╗ ██║██║   ██║██████╔╝█████╔╝ 
╚════██║  ╚██╔╝  ██║     ██╔══╝  ██╔══██╗██║╚██╗██║██╔══╝     ██║   ██║███╗██║██║   ██║██╔══██╗██╔═██╗ 
███████║   ██║   ╚██████╗███████╗██║  ██║██║ ╚████║███████╗   ██║   ╚███╔███╔╝╚██████╔╝██║  ██║██║  ██╗
╚══════╝   ╚═╝    ╚═════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝   ╚═╝    ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝
        Hardware & Software Server Alert to Discord PowerBy hetrixtools https://hetrixtools.com/
`)

const express = require('express')
const app = express()
const bodyParser = require("body-parser")

const { Client, Intents, MessageEmbed } = require('discord.js');
const { Token, chatid, Port } = require('./config.json')

const client = new Client({
    intents: [
        "GUILD_MESSAGES"
    ]
});

client.login(Token)

client.on('ready', async (message) => {
    console.log(`${message.user.username} Active.`)
})

app.use(bodyParser.json())

app.post('/powertinnerx/', function (req, res) {
    hook(req.body)
})

async function hook(data) {
    if (data["monitor_type"]) {
        let data_em = new MessageEmbed()
            .setTitle(`Status ${data["monitor_status"]}`)
            .setDescription(`Server : ${data["monitor_name"]} \nType : ${data["monitor_type"]}\nTimestamp : ${data["timestamp"]}\n${data["monitor_category"] === "" ? "" : `Category : ${data["monitor_category"]}`}`)
            .setColor(data["monitor_status"] === "online" ? 'GREEN' : 'RED')
            .setTimestamp()
            .setFooter(`Monitor ID : ${data["monitor_id"]}`)
        client.channels.cache.get(chatid).send({ embeds: [data_em] })

        client.user.setActivity(`New Alert [ ${data["monitor_name"]} | ${data["monitor_type"]} | ${data["monitor_status"]} ]`, { type: 'PLAYING', status: "dnd" });
    } else {
        if (['ram', 'swap', 'cpu'].includes(data["resource_usage"]["resource_type"])) {
            let data_em = new MessageEmbed()
                .setTitle(`Abnormal status detected [ ตรวจพบสถานะผิดปกติ ]`)
                .setDescription(`Server Name : ${data["monitor_name"]}\nUsage Type : ${data["resource_usage"]["resource_type"]}\nCurrent Use : ${data["resource_usage"]["current_usage"]}%\nAverage Use : ${data["resource_usage"]["average_usage"]}%\nAverage Min : ${data["resource_usage"]["average_minutes"]} minutes\nTimestamp : ${data["timestamp"]}`)
                .setColor("YELLOW")
                .setTimestamp()
                .setFooter(`Monitor ID : ${data["monitor_id"]} `)

            client.channels.cache.get(chatid).send({ embeds: [data_em] })
            client.user.setActivity(`New Alert [ ${data["monitor_name"]} | ${data["resource_usage"]["resource_type"]} | ${data["resource_usage"]["resource_type"]}/${data["resource_usage"]["current_usage"]}% ]`, { type: 'PLAYING', status: "dnd" });
        }
        if (['network_outbound', 'network_inbound'].includes(data["resource_usage"]["resource_type"])) {
            let data_em = new MessageEmbed()
                .setTitle(`Abnormal status detected [ ตรวจพบสถานะผิดปกติ ]`)
                .setDescription(`Server Name : ${data["monitor_name"]}\nUsage Type : ${data["resource_usage"]["resource_type"]}\nAverage Use : ${data["resource_usage"]["average_usage"]}\nAverage Min : ${data["resource_usage"]["average_minutes"]} minutes\nTimestamp : ${data["timestamp"]}`)
                .setColor("YELLOW")
                .setTimestamp()
                .setFooter(`Monitor ID : ${data["monitor_id"]}`)

            client.channels.cache.get(chatid).send({ embeds: [data_em] })
            client.user.setActivity(`New Alert [ ${data["monitor_name"]} | ${data["resource_usage"]["resource_type"]} | ${data["resource_usage"]["average_usage"]} ]`, { type: 'PLAYING', status: "dnd" });
        }
        if (data["resource_usage"]["resource_type"] === "disk") {
            let data_em = new MessageEmbed()
                .setTitle(`Abnormal status detected [ ตรวจพบสถานะผิดปกติ ]`)
                .setDescription(`Server Name : ${data["monitor_name"]}\nUsage Type : ${data["resource_usage"]["resource_type"]}\nAverage Use : ${data["resource_usage"]["average_usage"]}%\nAverage Min : ${data["resource_usage"]["average_minutes"]} minutes\nTimestamp : ${data["timestamp"]}`)
                .setColor("YELLOW")
                .setTimestamp()
                .setFooter(`Monitor ID : ${data["monitor_id"]}`)

            client.channels.cache.get(chatid).send({ embeds: [data_em] })
            client.user.setActivity(`New Alert [ ${data["monitor_name"]} | ${data["resource_usage"]["resource_type"]} | ${data["resource_usage"]["average_usage"]} ]`, { type: 'PLAYING', status: "dnd" });
        }
    }
}

app.listen(Port, () => {
    console.log(`Start Port ${Port}`)
})
