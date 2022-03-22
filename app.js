const { Hive } = require('@splinterlands/hive-interface');
const { HiveEngine } = require('@splinterlands/hive-interface');
const axios = require('axios');
const colors = require('colors');
const config = require('./config.json');
const schedule = require('node-schedule');

const hive = new Hive({
	logging_level: 0,
	rpc_nodes: config.rpc_nodes
});
let hive_engine = new HiveEngine();

var SPKAPI = config.spk_api;
var JSONIDCLAIM = config.json_id_claim;
var JSONIDSEND = config.json_id_send;

var ISCLAIM = config.is_claim;
var ISSEND = config.is_send;

var SENDTO = config.send_to;
var SENDMEMO = config.send_memo;

var DECIMAL = config.decimal;
DECIMAL = parseInt(DECIMAL) || 0;
var TIMEOUT = config.timeout;
TIMEOUT = parseInt(TIMEOUT) || 0;
var RECTIMEOUT = config.rec_timeout;
RECTIMEOUT = parseInt(RECTIMEOUT) || 0;
var HETIMEOUT = config.he_timeout;
HETIMEOUT = parseInt(HETIMEOUT) || 0;
var BLOCKTIMEOUT = config.block_timeout;
BLOCKTIMEOUT = parseInt(BLOCKTIMEOUT) || 0;

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const processLARYNX = async () => {
	try 
	{
		if(ISCLAIM == true)
		{
			await claimProcess();
		}
		if(ISSEND == true)
		{
			await sendProcess();
		}
	} 
	catch (error) 
	{
		console.log("Error at processLARYNX() : ", error);
	}
}

const claimProcess = async () => {
	try 
	{
		var userList = config.user_setting.accounts;
		if(userList.length > 0)
		{
			async function recursive(n)
			{
				if (n <= userList.length - 1) 
				{
					var accountName = userList[n][0];
					var accountActiveKey = userList[n][1];
					var claimStatus = userList[n][2];
					var sendStatus = userList[n][3];

					if(claimStatus == true)
					{
						var alreadyClaimed = await getClaimRequest(accountName);
						if(alreadyClaimed == false)
						{
							var claimStatus = await claimLARYNX(accountName, accountActiveKey);
							if(claimStatus == true)
							{
								console.log(accountName, "TOKEN CLAIMED SUCCESSFULLY".yellow);
							}
							else
							{
								console.log(accountName, "TOKEN CLAIM FAILED".red);
							}		
							await timeout(RECTIMEOUT);
							await recursive(n + 1);
						}
						else
						{
							console.log(accountName, "TOKEN ALREADY CLAIMED".green);
							await timeout(RECTIMEOUT);
							await recursive(n + 1);
						}
					}
					else
					{
						console.log(accountName, "CLAIM STATUS FALSE".red);
						await timeout(RECTIMEOUT);
						await recursive(n + 1);
					}
				}				
				else
				{
					console.log("ALL USER CLAIMS PROCESSED".blue);
					
				}
			}
			await recursive(0);
		}
	} 
	catch (error) 
	{
		console.log("Error at claimProcess() : ", error);
	}
}

const getClaimRequest = async (accountName) => {
	var claimStatus = false;
    try 
	{
        const res = await axios.get(SPKAPI + accountName);
		var lastClaim = parseInt(res.data.drop.last_claim) || 0;
		var totalClaims = parseInt(res.data.drop.total_claims) || 0;
		
		if(lastClaim != 0 && totalClaims != 0)
		{
			if(lastClaim == totalClaims)
			{
				claimStatus = true;
			}
		}		
		return claimStatus;
    } 
	catch (error) 
	{
		console.log("Error at getClaimRequest() : ", error);
		return claimStatus;
    }
};

const claimLARYNX = async (accountName, accountActiveKey) => {
	var claimStatus = false;
	try 
	{
		var transferObj = {};

		let claimTrans = await hive.custom_json(JSONIDCLAIM, transferObj, accountName, accountActiveKey, true);
		await timeout(HETIMEOUT);
		console.log("claimTrans : ", claimTrans);
		if(claimTrans.id != "") 
		{
			console.log("CLAIM SUCCESSFULLY".blue);			
			claimStatus = true;			
		}
		return claimStatus;
	} 
	catch (error) 
	{
		console.log("Error at claimLARYNX() : ", error);
		return claimStatus;
	}
}

const sendProcess = async () => {
	try 
	{
		var userList = config.user_setting.accounts;
		if(userList.length > 0)
		{
			async function recursive(n)
			{
				if (n <= userList.length - 1) 
				{
					var accountName = userList[n][0];
					var accountActiveKey = userList[n][1];
					var claimStatus = userList[n][2];
					var sendStatus = userList[n][3];

					if(sendStatus == true)
					{
						var balanceData = await getBalanceRequest(accountName);
						if(balanceData > 0.0)
						{
							var tokenSendStatus = await sendBalance(accountName, accountActiveKey, balanceData);  
							if(tokenSendStatus == true)
							{
								console.log(accountName, "TOKEN SENT SUCCESSFULLY".yellow);
							}
							else
							{
								console.log(accountName, "TOKEN FAILED TO SENT".yellow);
							}
							await timeout(RECTIMEOUT);
							await recursive(n + 1);
						}
						else
						{
							console.log(accountName, "NO ENOUGH BALANCE".red);
							await timeout(RECTIMEOUT);
							await recursive(n + 1);
						}
					}
					else
					{
						console.log(accountName, "SEND STATUS FALSE".red);
						await timeout(RECTIMEOUT);
						await recursive(n + 1);
					}
				}				
				else
				{
					console.log("TOKEN SENDING PROCESS FINISHED".blue);
				}
			}
			await recursive(0);
		}
	} 
	catch (error) 
	{
		console.log("Error at sendProcess() : ", error);
	}
}

const getBalanceRequest = async (accountName) => {
	var tokenBalance = 0.0;
    try 
	{
        const res = await axios.get(SPKAPI + accountName);
        tokenBalance = parseInt(res.data.balance) || 0;
		return tokenBalance;
    } 
	catch (error) 
	{
		console.log("Error at getBalanceRequest() : ", error);
		return tokenBalance;
    }
};

const sendBalance = async (accountName, accountActiveKey, tokenAmount) => {
	var sendStatus = false;
	try 
	{
		var transferObj = {
			to: SENDTO,
			amount: tokenAmount,
			memo: SENDMEMO,
			from: accountName
		};

		let sendTrans = await hive.custom_json(JSONIDSEND, transferObj, accountName, accountActiveKey, true);
		await timeout(HETIMEOUT);
		console.log("sendTrans : ", sendTrans);
		if(sendTrans.id != "") 
		{
			console.log("TOKEN SENT SUCCESSFULLY".blue);			
			sendStatus = true;			
		}
		return sendStatus;
	} 
	catch (error) 
	{
		console.log("Error at sendBalance() : ", error);
		return sendStatus;
	}
}

// trigger at utc time
const ruleProcess = {
	...config.trigger,
	tz: 'Etc/UTC',
};
if(config.enabled == true)
{
	schedule.scheduleJob(ruleProcess, processLARYNX);
}
processLARYNX();
