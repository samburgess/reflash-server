const http = require('https')
const fs = require('fs')
const port = 3000


const options = {

	key: fs.readFileSync('/etc/letsencrypt/live/reflash-server.be/privkey.pem'),
	cert: fs.readFileSync('/etc/letsencrypt/live/reflash-server.be/fullchain.pem'),
	ca: fs.readFileSync('/etc/letsencrypt/live/reflash-server.be/chain.pem')
}


const server = http.createServer(options, (req, res) => {

	let data = fs.readFileSync('testData.json')

	const headers = {
		'Access-Control-Allow-Origin':'*',
		"Access-Control-Allow-Methods": "OPTIONS, POST, GET",
	        "Access-Control-Max-Age": 2592000, // 30 days
	}

	if(req.method === 'POST'){
		let body = '';
    		req.on('data', chunk => {
	        	body += chunk.toString(); // convert Buffer to string
		});
		req.on('end', () => {
			let json = JSON.parse(body)
			let reqType = json[0]
			let user = json[1]
			let newData = json[2]

			let oldData = JSON.parse(data)

			if(reqType === 'new cards'){
				let i;
				for(i=0; i<oldData.length; i++){
					if(oldData[i][0] === user){
						oldData[i][1] = newData
					}
				}
			}else if(reqType === 'new user'){
				oldData.push([newData, []])
			}

        		
			fs.writeFileSync("testData.json", JSON.stringify(oldData))
    		});
	}

	res.writeHead(200, headers)
	res.end(data)

})

server.listen( port, (error) => {
	if(error){
		console.log(error)
	}
})
