Let us talk about WebRTC(web Real Time  Communication)
<br/>
files,streams(Can be->Audio,Video,screen share) are distributed among peers

<h2>TCP:Transmission Control Protocol</h2>
this is being used by chat,sockets,Any Regular communication over web

It creates packets of data and sends  them to the destination(It ensures that 99% time data is reaching the destination).If any packet gets lost it will keep retransmitting until it reaches
<h2>UDP:User Datagram Protocol.</h2>
This protocol does not guarantee the delivery of data packets to their destination address. It only ensures that the data packet will reach its intended recipient (mainly audio,video streams are send)-->fast data transfer.
It doesn't ensure the data will reach the desitination because of losing of packets of data.

<h2>How to Connect Via UDP</h2>
<div>
<section>
<img src='./images/webRTC workflow  1.png'>
</section>
<img src='./images/WebRTC workflow 2.png'>
</div>