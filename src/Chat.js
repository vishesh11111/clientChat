
import React, { useEffect, useState } from 'react'
import ScrollToBottom from "react-scroll-to-bottom"

export const Chat = ({ socket, username, room }) => {

    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([])
    const [typing, setTyping] = useState("");


    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send_message", messageData)
            setMessageList((list) => [...list, messageData])
            setCurrentMessage("")
            setTyping("")
        }
    }


    useEffect(() => {

        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data])
            // setMessageList([...messageList, data])
        })

    }, [socket])

    useEffect(() => {
        if (typing == "") {
            setTyping("")
        }
        socket.on("typing", (data) => {
            setTyping(`${data}: is typing....`)
            setTimeout(() => {
                setTyping("");
            }, 9000);
        })
    }, [currentMessage]);

    console.log("dfdfdfdfd==>f", typing)
    return (
        <div className='chat-window'>
            <div className='chat-header'>
                <p>Live Chat</p>
            </div>
            <div className='chat-body'>
                <ScrollToBottom className='message-container'>
                    {messageList?.map((e) => (
                        <div className='message' id={username === e.author ? "you" : "other"}>
                            <div className='message-content'>
                                <p className='chat-tag'>{e.message}</p>
                            </div>
                            <div className='message-meta'>
                                <p id='time'>{e.author === username ? "you" : e.author}</p>
                                <p id='author'>{e.time == (new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()) ? "recently" : e.time}</p>
                            </div>
                        </div>
                    ))}
                    <div><p>{typing}</p></div>
                </ScrollToBottom>
            </div>
            <div className='chat-footer'>
                <input type="text" value={currentMessage} placeholder='Hey...' onChange={(e) => {
                    setCurrentMessage(e.target.value)
                    socket.emit("typingData", { room: room, username: username })
                    if (e.target.value == "") {
                        setTyping("");
                    }
                    // setTyping(`${username}: is typing....`)
                }} onKeyPress={(e) => { e.key === "Enter" && sendMessage() }} />
                <button onClick={sendMessage}>&#9658;</button>
            </div>


        </div>
    )
}
