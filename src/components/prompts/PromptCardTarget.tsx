import { ZoneType } from 'moonlands/src/types';
import { useRef } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
// @ts-ignore
import { CARD_IMAGE } from './PromptCardImage.jsx';

type ItemType = {
    id: string
    index: number
    zoneId: ZoneType
}
type PromptCardTargetProps = {
    zoneId: ZoneType,
    onEnter: (zoneId: ZoneType, item: { index: number, zoneId: ZoneType }) => void
}

export default function PromptCardTarget(props: PromptCardTargetProps) {
    const ref = useRef<HTMLDivElement>(null);

    const [collectedProps, drop] = useDrop({
        accept: CARD_IMAGE,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item, monitor) {
            if (monitor.isOver({ shallow: true }) && props.zoneId != (item as ItemType).zoneId) {
                props.onEnter(props.zoneId, item as { index: number, zoneId: ZoneType });
            }
        },
    });

    drop(ref);

    return <div className="zoneTarget" ref={ref}>+</div>
}