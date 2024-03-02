
import { useSocket } from "@/context/socket";
import { useEffect } from "react";
export default function Home() {
  const socket = useSocket();

  useEffect( () => {
    socket?.on( "conect", () => {
      console.log( socket.id );
    } );
  }, [socket] );

  return (
    <main>
      welcome
    </main>
  );
}
