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
    socket.on('certify chore', function(value){
        console.log('집안일 인증 요청');

        // room에 join한다
        socket.join(value.groupId);

        // room에 join되어 있는 클라이언트에게 메시지를 전송한다
        socket.braodcast.to(groupId).emit('certify chore', value.data);
    });

    //집안일 인증 응답
    socket.on('response chore', function(data){
        console.log('집안일 인증 응답 : ', data);

        // room에 join한다
        socket.join(value.groupId);

        // userId한테만 메세지 전송
        io.to(data.userId).emit('response chore', data.data);
    });

    //심부름 추가
    socket.on('add quest', function(data){
        console.log('심부름 추가 : ', data);

        // room에 join한다
        socket.join(value.groupId);

        // room에 join되어 있는 클라이언트에게 메시지를 전송한다
        socket.braodcast.to(groupId).emit('add quest', data.data);
    });

    //심부름 수락 알림
    socket.on('request quest', function(data){
        console.log('심부름 추가 : ', data);

        // room에 join한다
        socket.join(value.groupId);

        // userId한테만 메세지 전송
        io.to(data.userId).emit('request quest', data.data);
    });
});

server.listen(3000, function() {
  console.log('Socket IO server listening on port 3000');
});