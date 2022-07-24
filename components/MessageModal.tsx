import React, { useState, useEffect } from 'react';
import styles from '../styles/layout.module.css';
import { MessageI, ModalContext } from '../contexts/ModalContext';
import { useRef } from 'react';
const MessageModal = () => {
    const [messageQueue, setQueue] = useState<MessageI[]>([]);
    const [activeMessage, setActiveMessage] = useState<MessageI | undefined>(undefined);
    const [pauseMessageHide, setPause] = useState(false);
    const timeoutRef = useRef(null);
    const timeoutHideRef = useRef(null);
    const modalRef = useRef(null);



    // Sets activeNotification
    useEffect(() => {
        if (messageQueue.length === 0) return;
        if (activeMessage) return;
        setActiveMessage(messageQueue[0]);
    }, [messageQueue, activeMessage])

    // close notification timer
    useEffect(() => {
        if (!activeMessage) {
            // Removes message from queue after close
            setQueue(messageQueue.slice(1));
            return;
        }
        // Shows notification
        modalRef.current.style.transform = "translateX(0)";
        // Sets timer to hide notification after specified time
        timeoutRef.current = setTimeout(() => {
            modalRef.current.style.transform = "";
            // Sets timer to remove message after animation
            timeoutHideRef.current = setTimeout(() => {
                setActiveMessage(undefined);
            }, 200);
        }, activeMessage.hideAfter)
        // Unmount
        return () => {
            clearTimeout(timeoutRef.current);
            clearTimeout(timeoutHideRef.current);
            timeoutHideRef.current = null;
            timeoutRef.current = null;
        }
    }, [activeMessage]);

    // Reactivates close notification timer
    useEffect(() => {
        if (!activeMessage) {
            // Removes message from queue after close
            setQueue(messageQueue.slice(1));
            return;
        }
        if (!pauseMessageHide && !timeoutRef.current) {
            // Sets timer to hide notification after specified time
            timeoutRef.current = setTimeout(() => {
                modalRef.current.style.transform = "";
                // Sets timer to remove message after animation
                timeoutHideRef.current = setTimeout(() => {
                    setActiveMessage(undefined);
                }, 200);
            }, activeMessage.hideAfter)
            // Unmount
            return () => {
                clearTimeout(timeoutRef.current);
                clearTimeout(timeoutHideRef.current);
                timeoutHideRef.current = null;
                timeoutRef.current = null;
            }
        }
        if (pauseMessageHide && timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            clearTimeout(timeoutHideRef.current);
            timeoutHideRef.current = null;
            timeoutRef.current = null;
        }
    }, [pauseMessageHide, activeMessage]);

    const handleUserClose = () => {
        modalRef.current.style.transform = "";
        // FIXME Maybe handle unmount
        setTimeout(() => {
            setActiveMessage(undefined);
        }, 200);
    }

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
    }, [activeMessage])


    return (
        <ModalContext.Provider value={{ messageQueue, setQueue }}>
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
        </ModalContext.Provider >
    )
}

export default MessageModal