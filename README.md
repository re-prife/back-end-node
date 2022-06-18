# Socket.io

| http://52.204.65.160:3000

###  1. socket 연결 시 바로 `saveInfo` 전송
- ex
```js
socket.emit('saveInfo', {
  userId: 1,
  groupId : 1
})
```
`saveInfo`의 data로 `userId`와 `groupId`를 받고 있다.
- `userId` : `userId`를 통해서 socket id를 저장하고 찾는 용도로 사용한다. 
- `groupId` : socket 내 room 생성 시 고유 번호로 사용한다.

## 집안일 인증 요청
| `certifyChore`
### data 형식
```
{
  data: {
    category: "",
    userNickname: "",
    title: ""
  }
}
```
### 전송
```js
socket.emit('certifyChore', certifyChoreData);
```
### 수신
```js
socket.on('certifyChore', certifyChoreData => {
  console.log(certifyChoreData);
});
```
