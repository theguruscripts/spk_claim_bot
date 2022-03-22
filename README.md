# spk_claim_bot
This script can be used to claim SPK-Network LARYNX tokens per every month.

***
## Installation
This is a nodejs based application.
```
npm install --save
```
***
## Configuration
```javascript
{
	"enabled" : true,
	"trigger" : {
		"hour" : 12,						// Hour of the script process
		"minute" : 0						// Minute of the script process	
	},
	"spk_api" : "https://spktoken.dlux.io/@",			// SPK Api that used to get account details
	"json_id_claim" : "spkcc_claim",				// Json Id to claim LARYNX Tokens
	"json_id_send" : "spkcc_send",					// Json Id to send LARYNX Tokens
	"is_claim" : true,						// Process token claim - true or false
	"is_send" : true,						// Process token send to collector account - true or false
	"send_to" : "",							// Hive username of the LARYNX token collector
	"send_memo" : "",						// Memo to send tokens to collector account
	"decimal" : 1000,
	"timeout" : 5000,
	"rec_timeout" : 1000,
	"he_timeout" : 9000,
	"block_timeout" : 9000,
	"user_setting" : {
		"accounts" : [						// You can add any amount of accounts here
			["username_1", "active_key_1", true, false],	// ["hive_username", "hive_active_key", "claim_tokens - true or false", "snd_tokens - true or false"]
			["username_2", "active_key_1", true, true],
			["username_2", "active_key_1", true, true]
		]
	},
	"rpc_nodes" : [
		"https://api.deathwing.me",
		"https://hive.roelandp.nl",
		"https://api.openhive.network",
		"https://rpc.ausbit.dev",
		"https://hived.emre.sh",
		"https://hive-api.arcange.eu",
		"https://api.hive.blog",
		"https://api.c0ff33a.uk",
		"https://rpc.ecency.com",
		"https://anyx.io",
		"https://techcoderx.com",
		"https://hived.privex.io",
		"https://api.followbtcnews.com/"
	]
}
```
***
## Execute
```
node app.js
```
***
## Development
Encounter any issue or Bugs, Please report them [Here](https://github.com/theguruscripts/spk_claim_bot/issues).

The Script Developed by @theguruasia on HIVE.BLOG, @TheGuruAsia theguruasia#8947 on Discord.
