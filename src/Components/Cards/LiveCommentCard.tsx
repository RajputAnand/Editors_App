import { FC } from 'react'

interface ILiveCommentCard {
    comment: { id: string; username: string; text: string; time: string };
}

const LiveCommentCard: FC<ILiveCommentCard> = (props) => {
    const { comment } = props;

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12 || 12; // Convert 0 to 12 for midnight
        const formattedMinutes = minutes.toString().padStart(2, '0');
        return `${hours}:${formattedMinutes} ${ampm}`;
    }
    return (
        <div key={comment.id} className='rounded-xl border bg-slate-50 hover:bg-slate-100 px-4 py-3'>
            <div className='flex flex-wrap gap-2'>
                <p className='font-bold'>{comment.username}</p>
                <p className='text-gray-700'>{formatTime(comment.time)}</p>
            </div>
            <p className='mt-2'>{comment.text}</p>
        </div>
    )
}

export default LiveCommentCard