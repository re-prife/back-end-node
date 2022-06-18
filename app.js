var app = require('express')();
var server = require('http').createServer(app);
const EventEmitter = require('events');
// http server를 socket.io server로 upgrade한다
var io = require('socket.io')(server);
var event = new EventEmitter();

app.get('/', function(req, res) {
    //query string으로 해당 값 받음
    let eventType = req.query.eventType;    //event type : 심부름 추가/수락, 집안일 인증/응답
    let userId = req.query.userId;  //회원 ID
    let groupId = req.query.groupId;    //그룹 ID
    let data = req.body;    //안드로이드에서 알림시 필요한 데이터

    //이벤트 호출(userId, groupId, data를 객체 형태로 넘김)
    event.emit(eventType, {
        userId : userId,
        groupId : groupId,
        data : data
    });
});

// 기본 namespace에 접속
io.on('connection', function(socket) {

    //연결이 끊겼을때
    socket.on('disconnect', function(){
        console.log('클라이언트 접속 해제 : ', socket.id);
        socket.leave(groupId);  //그룹 아이디로 되어있는 room과의 연결 끊음
        clearInterval(socket.interval); //socket과 연결 끊음
    });

    //에러가 났을때
    socket.on('error', function(err){
        console.error(err);
    });

    //집안일 인증 요청
    socket.on('certify-chore', function(value){
        console.log('집안일 인증 요청');

        // room에 join한다
        socket.join(value.groupId);

        // room에 join되어 있는 클라이언트에게 메시지를 전송한다
        socket.braodcast.to(groupId).emit('certify-chore', value.data);
    });

    //집안일 인증 응답
    socket.on('response-chore', function(value){
        console.log('집안일 인증 응답 : ', value);

        // room에 join한다
        socket.join(value.groupId);

        // 특정 user한테만 메세지 전송
        io.to(data.userId).emit('response-chore', value.data);
    });

    //심부름 추가
    socket.on('add-quest', function(value){
        console.log('심부름 추가 : ', value);

        // room에 join한다
        socket.join(value.groupId);

        // room에 join되어 있는 클라이언트에게 메시지를 전송한다
        socket.braodcast.to(groupId).emit('add-quest', value.data);
    });

    //심부름 수락 알림
    socket.on('request-quest', function(value){
        console.log('심부름 승인 : ', value);

        // room에 join한다
        socket.join(value.groupId);

        // userId한테만 메세지 전송
        io.to(data.userId).emit('request-quest', value.data);
    });
});

server.listen(3000, function() {
  console.log('Socket IO server listening on port 3000');
});