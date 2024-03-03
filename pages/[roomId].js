
import usePeer from "@/hooks/usePeer";
import { useSocket } from "@/context/socket";
import { useEffect } from "react";

const Room = () => {
    const socket = useSocket();
    const { peer, myId } = usePeer();

}

export default Room;