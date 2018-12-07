import socketClient from './socketClient';
const EXTENSION_ID = 'deifcdeanbcgmdahmihammgpkdeddboi';
let localStreams = [];
let myPeerArray = [];
const iceServers = {
    "iceServers": [
        {
            urls: [
                'stun:ss-turn1.xirsys.com',
                'turn:ss-turn1.xirsys.com:80?transport=udp',
                'turn:ss-turn1.xirsys.com:3478?transport=udp',
                'turn:ss-turn1.xirsys.com:80?transport=tcp',
                'turn:ss-turn1.xirsys.com:3478?transport=tcp',
                'turns:ss-turn1.xirsys.com:443?transport=tcp',
                'turns:ss-turn1.xirsys.com:5349?transport=tcp'
            ],
            credential: '9d61b156-f159-11e8-807d-32b0c04e5b2c',
            username: '9d61b0d4-f159-11e8-96d8-adf817ff6a2f'
        }
    ]
};
const offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
  };
async function getVideoStream(idElement) {
    let stream = await navigator.mediaDevices
    .getUserMedia({
        video: true
        , audio: true
    });
    localStreams[0] = stream;
    localStreams[0].type = 'video';
    playStream(idElement, stream);
}
function getScreenStream() {
    try {
        window.chrome.runtime.sendMessage(EXTENSION_ID, { sources:  ['window', 'screen', 'tab']}, response => {
          if (response && response.type === 'success') {
            navigator.mediaDevices.getUserMedia({
              video: {
                mandatory: {
                  chromeMediaSource: 'desktop',
                  chromeMediaSourceId: response.streamId
                }
              }
            }).then(returnedStream => {
              localStreams[1] = returnedStream;
              playStream('myScreen', returnedStream)
            }).catch(err => {
              alert('Không lấy được dữ liệu từ màn hình')
            });
            } else {
              alert('Vui lòng bật plugin')
            }
        })
      } catch(e) {
        navigator.mediaDevices.getUserMedia({
          video: {
            mediaSource: ['screen']
          }
        }).then(returnedStream => {
          localStreams[1] = returnedStream;
          playStream('myScreen', returnedStream);
        });
      }
}
function playStream(idVideo, stream) {
    try {
        var video = document.getElementById(idVideo)
        video.srcObject = stream;
    } catch(ex) {
        stopStream()
    }
}
export function closeAllPeers(peerArray) {
    peerArray.map(peerObject => {
        peerObject.peer.close();
    })
    return [];
}
export function stopStream(){
    if (myPeerArray != null) {
        myPeerArray = closeAllPeers(myPeerArray)
    }
    if (localStreams[0]) {          
        localStreams[0].getTracks().forEach((track) => {track.stop();})     
    }
    if (localStreams[1]) {          
        localStreams[1].getTracks().forEach((track) => {track.stop();})     
    }
    localStreams = [];
}
export function hostStopStream(roomID) {
    socketClient.emitToPeer({
        type: 'stop',
        id: null, roomID
    })
}
export async function hostGetStream(video = false, screen = false) {
    if (video && screen == false) {
        await stopStream();
        await getVideoStream("myScreen");
    }
    else if (screen && video == false) {
        await stopStream();
        await getScreenStream("myScreen");
    }
    else if (video && screen) {
        await stopStream();
        await getVideoStream("myVideo");
        await getScreenStream("myScreen");
    }
}

export function shareStream(roomID) {
    hostStopStream();
    socketClient.emitBroadcastHostShareStream(roomID);
}

function newPeer(userID, roomID) {
    var newPeer = new RTCPeerConnection(iceServers);
    newPeer.addEventListener('icecandidate', (e) => {
        socketClient.emitToPeer({
            type: 'add', 
            candidate: e.candidate, 
            id: userID, roomID}, null
        )
    })
    newPeer.addEventListener('addstream', (e) => {
        localStreams.push(e.stream);
        if (localStreams.length == 1) {
            playStream("myScreen", e.stream);
        }
        else {
            playStream("myVideo", localStreams[0])
            playStream("myScreen", e.stream);
        }
        
    })
    return newPeer;
}
export const closePeer = (userID) => {
    for (let i = 0; i < myPeerArray.length; i++) {
        if (myPeerArray[i].userID == userID) {
            myPeerArray[i] = myPeerArray[0];
            myPeerArray.shift();
            break;
        }
    }
}
const getCandidateIndexInPeerArray = (userID) => {
    for (let i = 0; i < myPeerArray.length; i++) {
        if (myPeerArray[i].userID == userID) {
            return i;
        }
    }
}

export const hostCreateConnection = async (userID, roomID) => {
    var myNewPeer = await newPeer(userID, roomID);
    myPeerArray.push({userID, peer: myNewPeer});
    if (localStreams[0]) {
        localStreams[0].getTracks().forEach(track => myNewPeer.addTrack(track, localStreams[0]))
    }
    if (localStreams[1]) {
        myNewPeer.addStream(localStreams[1]);
    }
    const description = await myNewPeer.createOffer(offerOptions);
    myNewPeer.setLocalDescription(description);

    socketClient.emitToPeer({
        type: 'offer', description,
        id: userID, roomID
    }, 
        function(answer) {
            myNewPeer.setRemoteDescription(answer)
        });
}

export const clientAddIceCandidate = (userID, candidate) => {
    let index = getCandidateIndexInPeerArray(userID);
    myPeerArray[index].peer.addIceCandidate(candidate);
}

export const clientCreateConnection = async (userID, roomID) => {
    var myNewPeer = await newPeer(userID, roomID);
    myPeerArray.push({userID, peer: myNewPeer});
}

export const answer = async (offerDescription, userID, setRemoteForCreateOffer) => {
    let index = getCandidateIndexInPeerArray(userID);
    myPeerArray[index].peer.setRemoteDescription(offerDescription);
    let description = await myPeerArray[index].peer.createAnswer();
    myPeerArray[index].peer.setLocalDescription(description);
    setRemoteForCreateOffer(description);
}