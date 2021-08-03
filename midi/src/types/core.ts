import { MidiIoEvent } from 'midi-file-io';

export type MidiDeltaEvent = MidiIoEvent;
export type MidiOffsetEvent = Omit<MidiIoEvent, 'deltaTime'> & { offset: number };
