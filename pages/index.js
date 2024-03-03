import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import styles from '@/styles/home.module.css'
import { useState } from "react";


export default function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState( '' );
  const createAndJoin = () => {
    const roomId = uuidv4();
    router.push( `/${roomId}` );
  }
  const JoinRoom = () => {
    if ( roomId ) router.push( `/${roomId}` );
    else {
      alert( 'Please provide a valid room ID' );
    }
  }
  return (
    <div className={styles.homeContainer}>
      <h1>Google Meet Clone</h1>
      <div className={styles.enterRoom}>
        <input placeholder="Enter the room id" value={roomId} onChange={( e ) => setRoomId( e?.target?.value )} />
        <button onClick={JoinRoom}>Join Room</button>
      </div>
      <span className={styles.separatorText}>-------OR------</span>

      <button onClick={createAndJoin}>create a new Room</button>
    </div>
  );
}
