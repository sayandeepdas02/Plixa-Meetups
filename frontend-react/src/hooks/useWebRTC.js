// src/hooks/useWebRTC.js
// Manages the entire WebRTC call lifecycle: peer connections, local/remote streams, mic/cam toggles.
// Standalone — does NOT touch AuthContext, whiteboard state, or chat state.

import { useRef, useState, useEffect, useCallback } from 'react';

const ICE_CONFIG = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        // TURN slot (add credentials here when available):
        // { urls: 'turn:your.turn.server', username: '', credential: '' }
    ],
};

const MAX_PARTICIPANTS = 6;

export function useWebRTC(socketRef, boardId) {
    // ---- Refs (don't trigger re-renders, safe in event callbacks) ----
    const peerConnectionsRef = useRef(new Map()); // socketId → RTCPeerConnection
    const localStreamRef = useRef(null);

    // ---- State (trigger re-renders for UI) ----
    const [remoteStreams, setRemoteStreams] = useState(new Map()); // socketId → MediaStream
    const [isInCall, setIsInCall] = useState(false);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCamOn, setIsCamOn] = useState(true);
    const [callError, setCallError] = useState(null); // string | null
    const [localStream, setLocalStream] = useState(null);

    // ---- Helper: create a new RTCPeerConnection for a peer ----
    const createPeerConnection = useCallback((peerId) => {
        // Avoid duplicate connections
        if (peerConnectionsRef.current.has(peerId)) {
            return peerConnectionsRef.current.get(peerId);
        }

        const pc = new RTCPeerConnection(ICE_CONFIG);

        // Add all local tracks to the new peer connection
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => {
                pc.addTrack(track, localStreamRef.current);
            });
        }

        // When we get remote tracks, store the stream for this peer
        pc.ontrack = (event) => {
            const [stream] = event.streams;
            setRemoteStreams((prev) => {
                const next = new Map(prev);
                next.set(peerId, stream);
                return next;
            });
        };

        // Send ICE candidates to the peer via signaling
        pc.onicecandidate = (event) => {
            if (event.candidate && socketRef.current) {
                socketRef.current.emit('webrtc:ice-candidate', {
                    candidate: event.candidate,
                    to: peerId,
                });
            }
        };

        // Monitor connection health
        pc.oniceconnectionstatechange = () => {
            const state = pc.iceConnectionState;
            console.log(`[webrtc] ICE state with ${peerId}: ${state}`);
            if (state === 'failed' || state === 'disconnected' || state === 'closed') {
                cleanupPeer(peerId);
            }
        };

        peerConnectionsRef.current.set(peerId, pc);
        return pc;
    }, [socketRef]);

    // ---- Helper: clean up one peer ----
    const cleanupPeer = useCallback((peerId) => {
        const pc = peerConnectionsRef.current.get(peerId);
        if (pc) {
            pc.ontrack = null;
            pc.onicecandidate = null;
            pc.oniceconnectionstatechange = null;
            pc.close();
            peerConnectionsRef.current.delete(peerId);
        }
        setRemoteStreams((prev) => {
            const next = new Map(prev);
            next.delete(peerId);
            return next;
        });
    }, []);

    // ---- Helper: clean up ALL peers and local media ----
    const cleanupAll = useCallback(() => {
        peerConnectionsRef.current.forEach((_, peerId) => cleanupPeer(peerId));
        peerConnectionsRef.current.clear();

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((t) => t.stop());
            localStreamRef.current = null;
        }
        setLocalStream(null);
        setRemoteStreams(new Map());
        setIsInCall(false);
        setIsMicOn(true);
        setIsCamOn(true);
    }, [cleanupPeer]);

    // ---- Socket event handlers ----
    useEffect(() => {
        const socket = socketRef.current;
        if (!socket) return;

        // Another user joined the call — we (existing user) create an offer to them
        const onUserJoined = async ({ from }) => {
            if (!localStreamRef.current) return;
            if (peerConnectionsRef.current.size >= MAX_PARTICIPANTS - 1) return;

            try {
                const pc = createPeerConnection(from);
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                socket.emit('webrtc:offer', { sdp: offer, to: from });
            } catch (err) {
                console.error('[webrtc] Error creating offer:', err);
            }
        };

        // We received an offer — set remote description, create answer
        const onOffer = async ({ sdp, from }) => {
            if (!localStreamRef.current) return;
            try {
                const pc = createPeerConnection(from);
                await pc.setRemoteDescription(new RTCSessionDescription(sdp));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit('webrtc:answer', { sdp: answer, to: from });
            } catch (err) {
                console.error('[webrtc] Error creating answer:', err);
            }
        };

        // We received an answer — complete the peer connection
        const onAnswer = async ({ sdp, from }) => {
            try {
                const pc = peerConnectionsRef.current.get(from);
                if (pc && pc.signalingState !== 'stable') {
                    await pc.setRemoteDescription(new RTCSessionDescription(sdp));
                }
            } catch (err) {
                console.error('[webrtc] Error setting remote answer:', err);
            }
        };

        // ICE candidate from a peer
        const onIceCandidate = async ({ candidate, from }) => {
            try {
                const pc = peerConnectionsRef.current.get(from);
                if (pc && candidate) {
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                }
            } catch (err) {
                console.error('[webrtc] Error adding ICE candidate:', err);
            }
        };

        // A peer left the call
        const onUserLeft = ({ from }) => {
            cleanupPeer(from);
        };

        // Server rejected join (e.g. call full)
        const onError = ({ code, message }) => {
            console.warn(`[webrtc] Error ${code}: ${message}`);
            setCallError(message);
            cleanupAll();
        };

        socket.on('webrtc:user-joined', onUserJoined);
        socket.on('webrtc:offer', onOffer);
        socket.on('webrtc:answer', onAnswer);
        socket.on('webrtc:ice-candidate', onIceCandidate);
        socket.on('webrtc:user-left', onUserLeft);
        socket.on('webrtc:error', onError);

        return () => {
            socket.off('webrtc:user-joined', onUserJoined);
            socket.off('webrtc:offer', onOffer);
            socket.off('webrtc:answer', onAnswer);
            socket.off('webrtc:ice-candidate', onIceCandidate);
            socket.off('webrtc:user-left', onUserLeft);
            socket.off('webrtc:error', onError);
        };
    }, [socketRef, createPeerConnection, cleanupPeer, cleanupAll]);

    // ---- Cleanup on unmount ----
    useEffect(() => {
        return () => {
            if (localStreamRef.current) {
                socketRef.current?.emit('webrtc:leave-call');
                cleanupAll();
            }
        };
    }, [cleanupAll, socketRef]);

    // ---- Public API ----

    const joinCall = useCallback(async () => {
        if (isInCall) return;
        setCallError(null);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = stream;
            setLocalStream(stream);
            setIsInCall(true);
            socketRef.current?.emit('webrtc:join-call');
        } catch (err) {
            console.error('[webrtc] getUserMedia failed:', err);
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setCallError('Camera / microphone access denied. Please allow permissions and try again.');
            } else if (err.name === 'NotFoundError') {
                setCallError('No camera or microphone detected on this device.');
            } else {
                setCallError('Could not access media devices. Please check your browser settings.');
            }
        }
    }, [isInCall, socketRef]);

    const leaveCall = useCallback(() => {
        socketRef.current?.emit('webrtc:leave-call');
        cleanupAll();
    }, [socketRef, cleanupAll]);

    const toggleMic = useCallback(() => {
        if (!localStreamRef.current) return;
        const audioTrack = localStreamRef.current.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            setIsMicOn(audioTrack.enabled);
        }
    }, []);

    const toggleCam = useCallback(() => {
        if (!localStreamRef.current) return;
        const videoTrack = localStreamRef.current.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            setIsCamOn(videoTrack.enabled);
        }
    }, []);

    return {
        localStream,
        remoteStreams,
        isInCall,
        isMicOn,
        isCamOn,
        callError,
        joinCall,
        leaveCall,
        toggleMic,
        toggleCam,
    };
}
