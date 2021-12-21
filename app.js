// Creation of telegraf object
const { Telegraf } = require("telegraf");
// Importation of scenes
const { Scenes } = require("telegraf");

const axios = require("axios");

// Passing of telegram token, this would be your private key, creation of bot
const bot = new Telegraf("5011777563:AAGufvV9yS-NkHU_6X0Ypc3vIqEZyuLC_hE");

// Launching of the bot

// bot.use((ctx) =>{
//     // Function reply we give to the bot
//     ctx.reply("Hi Human!")
// }

//Creation of base scene

var stonkStopStatus = true;
var cryptoStopStatus = true;

//  Start command
bot.start((ctx) => {
  // Usage of SCENES

  // === basic API implementation, uncomment this pls
  ctx.telegram.sendMessage(
    ctx.message.chat.id,
    `What do you want to check today?   `,

    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Stock Market", callback_data: "stonks" }],
          [{ text: "Crypto Market", callback_data: "cryptobro" }],
        ],
      },
    }
  );
});

// ====================== STOCK ============================
// Handling the callback data from inline keyboard
bot.action("stonks", (ctx) => {
  // When stonks inline keyboard is selected, stopstatus is set to false
  stonkStopStatus = false;
  ctx.deleteMessage();
  ctx.answerCbQuery();
  ctx.reply(
    "Please key in the stock name please (Only the ticker name for now) "
  );

  // gets the appropriate text here.
  // if (stonkAnswer === true){

  // }
});

// action to go back to the crypto selection menu

// For stock, if stonkAnswer true, activate this bot.on

bot.action("return", (ctx) => {
  // Send message giving the user the option to check crypto as well niga
  stonkAnswer = false;
  ctx.deleteMessage();
  ctx.answerCbQuery();
  ctx.reply(
    `What do you want to check today?   `,

    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Stock Market", callback_data: "stonks" }],
          [{ text: "Crypto Market", callback_data: "cryptobro" }],
        ],
      },
    }
  );
});

// bot.help((ctx) => {
//   ctx.reply(`There are multiple cammands /start /help`);
// });

var cryptoData;
bot.action("cryptobro", async (ctx) => {
  // answer call back data
  ctx.deleteMessage();
  ctx.answerCbQuery();
  cryptoStopStatus = false;
  console.log(cryptoData);
  console.log("Hi this is the crypto section");
  ctx.reply(
    "Please key in the crypto currency please (Only the symbol name for now)"
  );

  ctx.answerCbQuery();

  // if (cryptoData === true){

  // }
});

// Universal bot.on , it will be triggered by conditionals , if user type random stuff it will still trigger this but it won't work
bot.on("text", async (ctx) => {
  //Workaround method
  console.log(stonkStopStatus);
  console.log(cryptoStopStatus);

  // ===== Stonks section =====
  if (stonkStopStatus === false) {
    console.log("stonks heer");
    console.log(ctx.message.text);
    ctx.telegram.sendMessage(ctx.message.chat.id,"Searching now pls wait ");
    let text = ctx.message.text.toUpperCase();


    //getDataStonks is a async function

    getDataStonks(text)
      .then((result) => {
        
        console.log(result);
        if (result.c != 0) {
          // Gets the date of the retrieve API call
          ctx.deleteMessage();
          var date = new Date(result.t * 1000);
          bot.telegram.sendMessage(
            ctx.message.chat.id,
            `
<b>Stock selected:</b> ${text}
<b>Last updated:</b> ${date}

<b>currentPrice:</b> $ ${result.c}
<b>Change: </b>$ ${result.d}
<b>Percent Change:</b> $ ${result.dp} 
<b>Percent Change:</b> $ ${result.h}
<b>Low price of the day:</b> $ ${result.l}
<b>Open price of the day:</b> $ ${result.o}
<b>Previous close price:</b> $ ${result.pc}

======================================================
<b>Search for another stock by simply typing in the ticker name again</b> 
            `,
            {
              parse_mode: "HTML",
              reply_markup: {
                inline_keyboard: [
                  [{ text: "Return to start", callback_data: "return" }],
                  [{ text: "Search again", callback_data: "stonks" }],

                ],
              },
            }
          );

          // stopStatus is true
          stonkStopStatus = true;

        } else {
          bot.telegram.sendMessage(
            ctx.message.chat.id,
            `Try to search for another stock and make sure it has the ticker name only`,
            {
              parse_mode: "HTML",
              reply_markup: {
                inline_keyboard: [
                  [{ text: "Return to start", callback_data: "return" }],
                  [{ text: "Search again", callback_data: "stonks" }],

                ],
              },
            }
          );
          stonkStopStatus = true;

        }
      })
      .catch((error) => {});
  }
  // ===== Crypto section =====
  else if (cryptoStopStatus === false) {

    console.log("crypto here");

    let text = ctx.message.text.toUpperCase();
    console.log(text);

    ctx.reply("Searching now crpytobro");


    getDataCrypto(text)
      .then((res) => {
        ctx.deleteMessage()
        console.log("Hi there is supposed to be an output here");

        ctx.telegram.sendMessage(
          ctx.message.chat.id,
`
<b>Coin Selected: </b> <b><u>${res[0].toUpperCase()}</u></b>
<b>Date: </b> ${res[1].last_updated.substring(0, 10)}
<b>Time updated: </b> ${res[1].last_updated.substring(11, 19)} UTC time
<b>Price: </b> $ ${res[1].price}
<b>Volume_24h: </b> ${res[1].volume_24h}
<b>Volume_Change 24: h</b> ${res[1].volume_change_24h * 100} % 
<b>Percent Change 1h: </b> ${res[1].percent_change_1h * 100} %
<b>Percent Change 24h: </b> ${res[1].percent_change_24h * 100} %
<b>Percent Change 7d: </b> ${res[1].percent_change_7d * 100} %
<b>Percent Change 30d: </b> ${res[1].percent_change_30d * 100} %
<b>Percent Change 60d: </b> ${res[1].percent_change_60d * 100} %
<b>Percent Change 90d: </b> ${res[1].percent_change_90d * 100} %
<b>Market_Cap: </b> ${res[1].market_cap}`,
          {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [{ text: "Return to start", callback_data: "return" }],
                [{ text: "Search again", callback_data: "cryptobro" }],

              ],
            },
          }
        );

        cryptoStopStatus = true;
      })
      .catch((error) => {
        console.log(error);

        ctx.telegram.sendMessage(
          ctx.message.chat.id,
          "Not found, please try again",
          {
            reply_markup: {
              inline_keyboard: [
                [{ text: "Return to start", callback_data: "return" }],
                [{ text: "Search again", callback_data: "cryptobro" }],

              ],
            },
          }
          
        );
        cryptoStopStatus = true;

      });
  }
});


bot.launch();

// functions section

// fetches the relevant stock price
async function getDataStonks(ticker) {
  var key = "c6sktjiad3ie4g2fjp0g";
  var symbols = ticker;

  var url = `https://finnhub.io/api/v1/quote?symbol=${symbols}&token=${key}`;

  let res = await axios.get(url);
  stockDetails = res.data;
  price = res.data.c;

  return stockDetails;
}

// Function that checks whether the ticker name is valid

async function getDataCrypto(symbol) {
  var key = "611950bc-1046-4dce-9b52-2ca9727a7d49";
  `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?CMC_PRO_API_KEY=611950bc-1046-4dce-9b52-2ca9727a7d49&symbol=BTC`;
  var url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?CMC_PRO_API_KEY=${key}&symbol=${symbol}`;
  console.log(symbol);

  var resultArr = [];

  let res = await axios.get(url);
  console.log(typeof res);
  console.log(res.data.data[symbol].name);

  resultArr.push(res.data.data[symbol].name);
  resultArr.push(res.data.data[symbol].quote.USD);

  return resultArr;

  // console.log(res.data);
  // cryptoDetails = res.data;
  // price= res.data[`${symbol}`]["quote"]["USD"];
  // console.log(price);

  // return price;
}
