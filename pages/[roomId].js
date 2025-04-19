import { useEffect, useState, useRef } from "react";
import { cloneDeep } from "lodash";

import { useSocket } from "@/context/socket";
import usePeer from "@/hooks/usePeer";
import useMediaStream from "@/hooks/useMediaStream";
import usePlayer from "@/hooks/usePlayer";

import Player from "@/component/Player";
import Bottom from "@/component/Bottom";
import CopySection from "@/component/CopySection";
import ChatWindow from "@/component/ChatWindow";
import ChatInput from "@/component/ChatInput";

import styles from "@/styles/room.module.css";
import { useRouter } from "next/router";

const Room = () => {
  const socket = useSocket();
  const { roomId } = useRouter().query;
  const { peer, myId } = usePeer();
  const { stream } = useMediaStream();
  const {
    players,
    setPlayers,
    playerHighlighted,
    nonHighlightedPlayers,
    toggleAudio,
    toggleVideo,
    leaveRoom,
    toggleChat,
    showChat
  } = usePlayer( myId, roomId, peer );

  const [users, setUsers] = useState( {} );
  const [messages, setMessages] = useState( [] );
  const chatBoxRef = useRef( null );
  const pos = useRef( { x: 0, y: 0, offsetX: 0, offsetY: 0 } );

  const sendMessage = ( text ) => {
    if ( !text || !socket || !myId || !roomId ) return;
    socket.emit( "send-message", { roomId, userId: myId, text } );
    setMessages( ( prev ) => [...prev, { userId: myId, text }] );
  };


  const handleMouseDown = ( e ) => {
    const box = chatBoxRef.current;
    if ( !box ) return;

    pos.current.offsetX = e.clientX - box.getBoundingClientRect().left;
    pos.current.offsetY = e.clientY - box.getBoundingClientRect().top;

    document.addEventListener( "mousemove", handleMouseMove );
    document.addEventListener( "mouseup", handleMouseUp );
  };

  const handleMouseMove = ( e ) => {
    const box = chatBoxRef.current;
    if ( !box ) return;

    const x = e.clientX - pos.current.offsetX;
    const y = e.clientY - pos.current.offsetY;

    box.style.left = `${x}px`;
    box.style.top = `${y}px`;
    box.style.bottom = "auto"; // remove Tailwind bottom positioning
  };

  const handleMouseUp = () => {
    document.removeEventListener( "mousemove", handleMouseMove );
    document.removeEventListener( "mouseup", handleMouseUp );
  };

  useEffect( () => {
    if ( !socket || !peer || !stream ) return;

    const handleUserConnected = ( newUser ) => {
      console.log( `user connected in room with userId ${newUser}` );
      const call = peer.call( newUser, stream );
      call.on( "stream", ( incomingStream ) => {
        console.log( `incoming stream from ${newUser}` );
        setPlayers( ( prev ) => ( {
          ...prev,
          [newUser]: {
            url: incomingStream,
            muted: true,
            playing: true,
          },
        } ) );
        setUsers( ( prev ) => ( {
          ...prev,
          [newUser]: call
        } ) );
      } );
    };

    socket.on( "user-connected", handleUserConnected );

    return () => {
      socket.off( "user-connected", handleUserConnected );
    };
  }, [peer, setPlayers, socket, stream] );

  useEffect( () => {
    if ( !socket ) return;

    const handleToggleAudio = ( userId ) => {
      console.log( `user with id ${userId} toggled audio` );
      setPlayers( ( prev ) => {
        const copy = cloneDeep( prev );
        copy[userId].muted = !copy[userId].muted;
        return { ...copy };
      } );
    };

    const handleToggleVideo = ( userId ) => {
      console.log( `user with id ${userId} toggled video` );
      setPlayers( ( prev ) => {
        const copy = cloneDeep( prev );
        copy[userId].playing = !copy[userId].playing;
        return { ...copy };
      } );
    };

    const handleUserLeave = ( userId ) => {
      console.log( `user ${userId} is leaving the room` );
      users[userId]?.close();
      const playersCopy = cloneDeep( players );
      delete playersCopy[userId];
      setPlayers( playersCopy );
    };

    const handleReceiveMessage = ( { userId, text } ) => {
      setMessages( ( prev ) => [...prev, { userId, text }] );
    };

    socket.on( "user-toggle-audio", handleToggleAudio );
    socket.on( "user-toggle-video", handleToggleVideo );
    socket.on( "user-leave", handleUserLeave );
    socket.on( "receive-message", handleReceiveMessage );

    return () => {
      socket.off( "user-toggle-audio", handleToggleAudio );
      socket.off( "user-toggle-video", handleToggleVideo );
      socket.off( "user-leave", handleUserLeave );
      socket.off( "receive-message", handleReceiveMessage );
    };
  }, [players, setPlayers, socket, users] );

  useEffect( () => {
    if ( !peer || !stream ) return;

    peer.on( "call", ( call ) => {
      const { peer: callerId } = call;
      call.answer( stream );
      call.on( "stream", ( incomingStream ) => {
        console.log( `incoming stream from ${callerId}` );
        setPlayers( ( prev ) => ( {
          ...prev,
          [callerId]: {
            url: incomingStream,
            muted: true,
            playing: true,
          },
        } ) );
        setUsers( ( prev ) => ( {
          ...prev,
          [callerId]: call
        } ) );
      } );
    } );
  }, [peer, setPlayers, stream] );

  useEffect( () => {
    if ( !stream || !myId ) return;
    console.log( `setting my stream ${myId}` );
    setPlayers( ( prev ) => ( {
      ...prev,
      [myId]: {
        url: stream,
        muted: true,
        playing: true,
      },
    } ) );
  }, [myId, setPlayers, stream] );

  return (
    <>
      <div className={styles.activePlayerContainer}>
        {playerHighlighted && (
          <Player
            url={playerHighlighted.url}
            muted={playerHighlighted.muted}
            playing={playerHighlighted.playing}
            isActive
          />
        )}
      </div>

      <div className={styles.inActivePlayerContainer}>
        {Object.keys( nonHighlightedPlayers ).map( ( playerId ) => {
          const { url, muted, playing } = nonHighlightedPlayers[playerId];
          return (
            <Player
              key={playerId}
              url={url}
              muted={muted}
              playing={playing}
              isActive={false}
            />
          );
        } )}
      </div>

      <CopySection roomId={roomId} />

      <Bottom
        muted={playerHighlighted?.muted}
        playing={playerHighlighted?.playing}
        toggleAudio={toggleAudio}
        toggleVideo={toggleVideo}
        leaveRoom={leaveRoom}
        toggleChat={toggleChat}
        showChat={showChat}
      />


      {showChat && (
        <div
          className={styles.chatBox}
          ref={chatBoxRef}
          onMouseDown={handleMouseDown}
        >
          <ChatWindow messages={messages} />
          <ChatInput onSend={sendMessage} />
        </div>
      )}

    </>
  );
};

export default Room;
