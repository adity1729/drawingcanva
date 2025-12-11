import { getRoom } from "@/actions/getRoom"
import { RoomCanvas } from "@/canvas/RoomCanvas"


const page = async ({ params }: {
    params: Promise<{ roomName: string }>
}) => {
    const { roomName } = await params

    const room = await getRoom(roomName)

    if (!room) {
        return <p>The room Doesnt exist</p>
    }

    return (

        <RoomCanvas roomId={room.id} room={room} />

    )
}

export default page