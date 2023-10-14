const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(undefined, {
    path: '/peerjs',
    host:'/',
    port: '3000'
});

let myVideoStream
//Permissions for media
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false 
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', call => {
        console.log('Incoming call'); // Add a log statement to see if calls are received
        call.answer(myVideoStream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            console.log('Receiving user stream'); // Add a log statement to see if streams are received
            addVideoStream(video, userVideoStream);
        });
    });

    //peer.on('call', call => {
        //call.answer(stream)
        //const video = document.createElement('video')
        //call.on('stream', userVideoStream => {
            //addVideoStream(video, userVideoStream)
        //})
    //})

    socket.on('user-connected', (userId) => {
        //console.log('new user');
        connecToNewUser(userId, stream);
    })
})

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
    //console.log(id);
})
/*
//socket.emit('join-room', ROOM_ID); duplicate see peer.on

    socket.on('user-connected', (userId) => {
    //console.log('new user');
    connecToNewUser(userId, stream);
})
*/

const connecToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    //addVideoStream(video, userVideoStream)
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
   })
    //console.log(userId);
}
/*
const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListner('loadedmetadata', () => {
        video.play();
    });
    videoGrid.append(video);
}
*/
const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
}
/*
let text = $('input')

$('html').keydown((e) => {
    if (e.which == 13 && text.val().length !== 0) {
        console.log(text.val)
        socket.emit('message', text.val());
        text.val('')
    }
})
*/
$(document).ready(function() {
    let text = $('input')

    $('html').keydown((e) => {
        if (e.which == 13 && text.val().length !== 0) {
            console.log(text.val());
            socket.emit('message', text.val());
            text.val('')
        }
    })
});

socket.on('createMessage', message => {
    $('.messages').append(`<li class="message"><b>user</b><br/>${message}</li>`)
    console.log('this is coming from server', message)
    //didnt print message in console 
    scrollToBottom()
})

const scrollToBottom = () => {
    let d = $('.main__chat__window');
    d.scrollTop(d.prop("scrollHeight"));
}

const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
        } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () => {
    const html = `
        <i class="fas fa-microphone"></i>
        <span>Mute</span>
    `
    document.querySelector('.main__mute__button').innerHTML = html;
}

const setUnmuteButton = () => {
    const html = `
        <i class="unmute fas fa-microphone-slash"></i>
        <span>Unmute</span>
    `
    document.querySelector('.main__mute__button').innerHTML = html;
}

const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo() 
    } else {
        setStopVideo()
        myVideoStream.getVideoTracks()[0].enabled = true; 
    }
}

const setStopVideo = () => {
    const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
    `
    document.querySelector('.main__video__button').innerHTML = html;
}

const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
    `
    document.querySelector('.main__video__button').innerHTML = html;
}

