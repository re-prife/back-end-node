var app = require('express')();
var server = require('http').createServer(app);
const EventEmitter = require('events');
// http server를 socket.io server로 upgrade한다
var io = require('socket.io')(server);
var event = new EventEmitter();

app.get('/', function(req, res) {
    let notice = req.query.notice;
    let userId = req.query.userId;
    let groupId = req.query.groupId;
    let data = req.body;

    event.emit(notice, {
        userId : userId,
        groupId : groupId,
        data : data
    });
});


// namespace /chat에 접속한다.
io.on('connection', function(socket) {

    //연결이 끊겼을때
    socket.on('disconnect', function(){
        console.log('클라이언트 접속 해제 : ', socket.id);
        socket.leave(groupId);
        clearInterval(socket.interval);
    });

    //에러가 났을때
    socket.on('error', function(err){
        console.error(err);
    });

    //집안일 인증 요청
    socket.on('chore-certify-request', function(value){
        console.log('집안일 인증 요청');

        // room에 join한다
        socket.join(value.groupId);

        // room에 join되어 있는 클라이언트에게 메시지를 전송한다
        socket.braodcast.to(groupId).emit('chore certify request : ', value.data);
    });

    //집안일 인증 응답
    socket.on('chore certify response', function(data){
        console.log('집안일 인증 응답 : ', data);

        var groupId = socket.groupId = 

        // room에 join한다
        socket.join(groupId);

        // room에 join되어 있는 클라이언트에게 메시지를 전송한다
        socket.braodcast.emit('chore certify response', data.data);
    });

    //심부름 추가
    socket.on('add quest', function(data){
        console.log('심부름 추가 : ', data);

        var groupId = socket.groupId = 

        // room에 join한다
        socket.join(groupId);

        // room에 join되어 있는 클라이언트에게 메시지를 전송한다
        socket.braodcast.emit('add quest', data.data);
    });
});

server.listen(3000, function() {
  console.log('Socket IO server listening on port 3000');
});