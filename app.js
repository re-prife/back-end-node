const express = require('express');
const app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const clients = [];
app.get('/', function (req, res) {
    res.send('Freemily Node Server');
});

io.on('connection', function (socket) {
    let groupId;
    console.log('클라이언트 접속');

    socket.on('disconnect', function () {
        console.log('클라이언트 접속 해제');
        const index = clients.findIndex(e => e.id == socket.id);
        clients.splice(index, 1);
        clearInterval(socket.interval); //socket과 연결 끊음
    });

    socket.on('error', function (err) {
        console.error(err);
    });

    // userId와 socket id 저장 용도 
    socket.on('saveInfo', (data) => {
        const clientInfo = new Object();
        clientInfo.userId = data.userId;
        clientInfo.groupId = data.groupId;
        clientInfo.id = socket.id;
        console.log(clientInfo);
        clients.push(clientInfo);
        groupId = data.groupId;
        socket.join(groupId);
    })

    //집안일 인증 요청
    socket.on('certifyChore', function (value) {
        console.log('집안일 인증 요청 :', value);

        // room에 join되어 있는 클라이언트에게 메시지를 전송한다
        socket.broadcast.to(groupId).emit('certifyChore', value);
    });

    //집안일 인증 응답
    socket.on('acceptChore', function (value) {
        console.log('집안일 인증 응답 : ', value);

        // 집안일 담당자의 socket id 찾기
        const client = clients.find(e => e.userId == value.requesterId);

        // 특정 user한테만 메세지 전송
        io.to(client.id).emit('acceptChore', value);
    });

    //심부름 추가
    socket.on('addQuest', function (value) {
        console.log('심부름 추가 : ', value);

        for (i of value.userIds) {
            const client = clients.find(e => e.userId == i);
            console.log("전송할 client :", client)
            if (client === undefined) continue;
            io.to(client.id).emit('addQuest', value.data);
        }

    });

    //심부름 수락 알림
    socket.on('acceptQuest', function (value) {
        console.log('심부름 승인 : ', value);

        //심부름 요청자의 socket id 찾기
        const client = clients.find(e => e.userId == value.requesterId);

        // userId한테만 메세지 전송
        io.to(client.id).emit('acceptQuest', value.data);
    });
});

server.listen(3000, function () {
    console.log('Socket IO server listening on port 3000');
});