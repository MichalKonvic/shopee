import React, { useState, useEffect, useCallback } from 'react';
import styles from '../styles/layout.module.css';
import { MessageI, ModalContext } from '../contexts/ModalContext';
import { useRef } from 'react';
const MessageModalProvider = ({ children }) => {
    const [messageQueue, setQueue] = useState<MessageI[]>([]);
    const [activeMessage, setActiveMessage] = useState<MessageI | undefined>(undefined);
    const [pauseMessageHide, setPause] = useState(false);
    const timeoutRef = useRef(null);
    const timeoutHideRef = useRef(null);
    const modalRef = useRef(null);

    const addMessage = (message: MessageI) => {
        let _messageQueue: MessageI[] = [...messageQueue];
        _messageQueue.push(message);
        setQueue(_messageQueue);
    }

    // Sets activeNotification
    useEffect(() => {
        if (!messageQueue[0]) return;
        if (activeMessage) return;
        setActiveMessage(messageQueue[0]);
    }, [messageQueue, activeMessage])

    // Reactivates close notification timer
    useEffect(() => {
        if (!activeMessage) return;
        modalRef.current.style.transform = "translate(0px)";
        if (!pauseMessageHide) {
            // Sets timer to hide notification after specified time
            timeoutRef.current = setTimeout(() => {
                modalRef.current.style.transform = "";
                // Sets timer to remove message after animation
                timeoutHideRef.current = setTimeout(() => {
                    setActiveMessage(undefined);
                    // Removes message from queue after close
                    setQueue(messageQueue.slice(1));
                }, 200);
            }, activeMessage.hideAfter)
            // Unmount
            return () => {
                clearTimeout(timeoutRef.current);
                if (timeoutHideRef.current) {
                    clearTimeout(timeoutHideRef.current);
                    timeoutHideRef.current = null;
                }
                timeoutRef.current = null;
            }
        }
        return () => {
            setPause(false);
        }
    }, [activeMessage, messageQueue, pauseMessageHide]);

    const handleUserClose = () => {
        modalRef.current.style.transform = "";
        // FIXME Maybe handle unmount
        setTimeout(() => {
            setActiveMessage(undefined);
            // Removes message from queue after close
            setQueue(messageQueue.slice(1));
        }, 200);
    }

    // Click outside handler
    useEffect(() => {
        if (!activeMessage) return;
        const checkClickOutside = (e: any) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                handleUserClose && handleUserClose();
            }
        }
        document.addEventListener('click', checkClickOutside, true);
        return () => {
            document.removeEventListener('click', checkClickOutside, true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeMessage])

    return (
        <ModalContext.Provider value={{ messageQueue, addMessage }}>
            {activeMessage && <div ref={modalRef} className={styles.modalContainer} onPointerEnter={() => setPause(true)} onPointerLeave={() => setPause(false)}>
                <div className={styles.modal}>
                    <div className={styles.modalHeader}>
                        <div>
                            {activeMessage.type == "ERR" && <span className={styles.errorIcon + ' material-icons'}>error</span>}
                            {activeMessage.type == "WARN" && <span className={styles.warnIcon + ' material-icons'}>warning</span>}
                            {activeMessage.type == "INFO" && <span className={styles.infoIcon + ' material-icons'}>info</span>}
                            <p>{activeMessage.title}</p>
                        </div>
                        <span onClick={handleUserClose} className={styles.modalClose + ' material-icons'}>close</span>
                    </div>
                    <p className={styles.modalDescription}>{activeMessage.message}</p>
                </div>
            </div>}
            {children}
        </ModalContext.Provider >
    )
}

export default MessageModalProvider;