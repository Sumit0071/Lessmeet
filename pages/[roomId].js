
import usePeer from "@/hooks/usePeer";
import { useSocket } from "@/context/socket";
import { useEffect } from "react";
import useMediaStream from "@/hooks/useMediaStream";

import Player from "@/component/Player";
const Room = () => {
    const socket = useSocket();
    const { peer, myId } = usePeer();
    const { stream } = useMediaStream();
    return (
        <div className="videoPlayer">
            <Player url={stream} muted playing playerId={myId} />
        </div>
    )

};



export default Room;