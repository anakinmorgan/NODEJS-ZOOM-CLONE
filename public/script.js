// Javascript for the front end
// Access Video and Audio
const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
});

let myVideoStream;
navigator.mediaDevices.getUserMedia( {
    video: true,
    audio: true
}).then(stream => {

    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream);
    })

    let text = $('input')

    $('html').keydown((e) => {
    if (e.which == 13 && text.val().length !==0) {
        //console.log(text.val())
        socket.emit('message', text.val());
        text.val('')
        }// using jquery ($ replaces Jquery) want to get user input
        // then when in the html page and the user presses enter (13 is the code assigned to the enter key on a keyboard)
        // so when the user hits enter & there is text in the val(being the message a user wants to send) and is not empty
        //socket.emit means send socket on means get so store the users message in message
        //finaly set the box area back to nothing for the next user to message
    });

    socket.on('createMessage', message => {
        $('.messages').append(`<li class="message"><b>user</b><br/>${message}</li>`);
        scrollToBottom()// this will be so the messages dont go off the bottom of page
    })// this is getting whatever message back to the same room only and for everyone to see
})

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
});

const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
}


const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
}

const scrollToBottom = () => {
    let d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}
// Mute the video
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
    document.querySelector('.main__mute_button').innerHTML = html;
  }

  const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
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
    document.querySelector('.main__video_button').innerHTML = html;
  }
  
  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }
