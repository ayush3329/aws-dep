import { IUtf8Message, Message, connection,  server } from 'websocket'
import http from 'http'
import { ParsedUrlQuery } from 'querystring';


const httpServer = http.createServer((req, res) => {
    console.log("Server started");
})


const websocket = new server({
    "httpServer": httpServer
})

var connectionsToUser = new Map<connection, string>();
var UserToConnection = new Map<string, connection>();

websocket.on("request", (request) => {

    console.log("New Request");
   
    const user:string = (request.resourceURL.query as ParsedUrlQuery).userID as string;
    console.log(user)
    let connections:connection = request.accept(null, request.origin);

    connectionsToUser.set(connections, user)
    UserToConnection.set(user, connections)




    connections.on("message", (data:Message) => {

        const parsedData = JSON.parse((data as IUtf8Message).utf8Data || '{}');
        let query:string = parsedData.query;


        console.log("query ", query);
        console.log("nessage", parsedData.message);
        connections.sendUTF(JSON.stringify( {mesaage: parsedData.message, num: Math.random()} ) );

        
        
    })

    connections.on("close", (code, des)=>{

        console.log("Close event");
        var saveUser = connectionsToUser.get(connections) as string;
        UserToConnection.delete(saveUser);
        connectionsToUser.delete(connections);
        console.log(code);
        console.log(des);
        console.log("\n\n");
        
    })

})

httpServer.listen(9929, () => {
    console.log("http server started at 9929");
})
console.log("Hello world");


