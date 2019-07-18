'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
// const PORT = process.env.PORT || 3000;


const config = {
	channelSecret: process.env.CHANNELSECRET,
	channelAccessToken: process.env.ACCESSTOKEN
};

const app = express();

app.get('/', (req, res) => {
	console.log("l.16 ここにきた");
	res.send('M5Stack test bot Hello LINE BOT!(GET)');//ブラウザ確認用(無くても問題ない)
});

app.post('/webhook', line.middleware(config), (req, res) => {
	console.log("l.21 ここにきた");
	console.log(req.body.events);

	//ここのif分はdeveloper consoleの"接続確認"用なので削除して問題ないです。
	if (req.body.events[0].replyToken === '00000000000000000000000000000000' && req.body.events[1].replyToken === 'ffffffffffffffffffffffffffffffff') {
		res.send('Hello LINE BOT!(POST)');
		console.log('疎通確認用');
		return;
	}

	Promise
		//		.all(req.body.events.map(handleEvent))
		.all(req.body.events.map(handler))
		.then((result) => res.json(result));
});

const client = new line.Client(config);

// function handleEvent(event) {
// 	if (event.type !== 'message' || event.message.type !== 'text') {
// 		return Promise.resolve(null);
// 	}

// 	return client.replyMessage(event.replyToken, {
// 		type: 'text',
// 		text: event.message.text //実際に返信の言葉を入れる箇所
// 	});
// }


// function handleEvent(event) { // apply lambda function 20190718 sito

exports.handler = function (event, context) { //lambda

	let mes = '';
	console.log('---')
	console.log(event);
	if (event.type !== 'things') {
		return Promise.resolve(null);
	}

	if (event.type === 'things' && event.things.type === 'link') {
		mes = 'デバイスと接続しました。';
	} else if (event.type === 'things' && event.things.type === 'unlink') {
		mes = 'デバイスとの接続を解除しました。';
	} else {
		const thingsData = event.things.result;
		if (!thingsData.bleNotificationPayload) return
		// bleNotificationPayloadにデータが来る
		const blePayload = thingsData.bleNotificationPayload;
		const buffer = new Buffer.from(blePayload, 'base64');
		const data = buffer.toString('hex');  //Base64をデコード
		console.log(buffer);
		console.log("Payload=" + parseInt(data, 16));
	}



}


// app.listen(PORT);
// console.log(`Server running at ${PORT}`);