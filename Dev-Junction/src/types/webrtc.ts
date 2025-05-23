export interface PeerConnection {
    connection: RTCPeerConnection;
    stream?: MediaStream;
    videoTrack?: MediaStreamTrack;
    audioTrack?: MediaStreamTrack;
  }
  
  export interface Message {
    type: 'offer' | 'answer' | 'candidate' | 'chat';
    sender: string;
    target: string;
    data: any;
    timestamp: number;
  }
  
  export interface ChatMessage {
    id: string;
    sender: string;
    content: string;
    timestamp: number;
  }
  
  export interface Participant {
    id: string;
    name: string;
    isAudioEnabled: boolean;
    isVideoEnabled: boolean;
    isScreenSharing: boolean;
  }