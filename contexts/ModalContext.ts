import { createContext } from "react";
interface MessageI {
    title: string;
    type: "ERR" | "WARN" | "INFO";
    message: string;
    hideAfter: number;
}
const messageQueue: MessageI[] = [];
export const ModalContext = createContext({
    messageQueue,
    setQueue: (_data:MessageI[])=>{}
})
export type {MessageI};