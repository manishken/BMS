'use client';
// import React from "react";
// import PubNub from "pubnub";
// import { PubNubProvider } from "pubnub-react";
// import { Chat, MessageList, MessageInput } from "@pubnub/react-chat-components";


// /* Creates and configures your PubNub instance. Be sure to replace "myPublishKey" and "mySubscribeKey"
// with your own keyset. If you wish, modify the default "myFirstUser" userId value for the chat user. */

// const currentChannel = "Default";
// const theme = "light";

// function Page(): JSX.Element {
//     let userName:any = ''
//     if (typeof window !== "undefined" && window?.localStorage.length > 0) {
//         userName = window?.localStorage.getItem('userName') ? window?.localStorage.getItem('userName'): 'anonymous'
//     }
//     const pubnub = new PubNub({
//         publishKey: "pub-c-0ecddc19-f774-4557-b122-a05678e52421",
//         subscribeKey: "sub-c-606250c4-d7f1-4663-8284-df1f40070bbe",
//         userId: userName? userName: 'anonymous'
//     });
//     return (
//         <>
//              <div className="d-flex justify-space-between w-100">
//                 <div className="h-100 w-75">
//                     <PubNubProvider client={pubnub}>
//                         <Chat {...{ currentChannel, theme }}>
//                             <div className="mt-2" style={{ overflow: 'scroll', maxHeight: '88%', height: '650px', width: '100%' }}>
//                                 <MessageList />
//                             </div>
//                             <div style={{ width: '100%' }}>
//                                 <MessageInput />
//                             </div>
//                         </Chat>
//                     </PubNubProvider>
//                 </div>
//             </div></>
//     );
// }

// export default Page;

import React, { useCallback, useEffect, useRef, useState } from "react"
import { Channel, Chat, Message, MixedTextTypedElement, TimetokenUtils, User } from "@pubnub/chat"
import "./page.css"
import axios from "axios";


let BACKEND_API_URL = ''

if (process.env.NEXT_PUBLIC_BACKEND_API_URL) {
    BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL
} else {
    BACKEND_API_URL = 'http://127.0.0.1:8000/'
}

let REDIRECT_URL = ''

if(process.env.NEXT_PUBLIC_BACKEND_API_URL) {
    REDIRECT_URL =  'https://bms-6.netlify.app'
} else {
    REDIRECT_URL = 'http://localhost:3000'
}

const userData = [
    {
        id: "support-agent",
        data: { name: "John (Support Agent)", custom: { initials: "SA", avatar: "#9fa7df" } },
    },
    {
        id: "supported-user",
        data: { name: "Mary Watson", custom: { initials: "MW", avatar: "#ffab91" } },
    },
]
const randomizedUsers = Math.random() < 0.5 ? userData : userData.reverse()

export default function App() {
    const [chat, setChat] = useState<Chat>()
    const [text, setText] = useState("")
    const [users, setUsers] = useState<User[]>([])
    const [channel, setChannel] = useState<Channel>()
    const [messages, setMessages] = useState<Message[]>([])
    const [others, setOthers] = useState<any>([])
    const [manageUser, setManageUser] = useState<any>([])
    const [selectedUser, setSelectedUser] = useState('')
    const messageListRef = useRef<HTMLElement>(null)
    const [role, setRole] = useState<any>('')
    let userName:any = ''
    if (typeof window !== "undefined" && window?.localStorage.length > 0) {
        userName = window?.localStorage.getItem('userEmail') ? window?.localStorage.getItem('userEmail'): 'anonymous'
    }

    async function handleSend(event: React.SyntheticEvent) {
        event.preventDefault()
        if (!text || !channel) return
        await channel.sendText(text)
        setText("")
    }

    useEffect(() => {
        if (!messageListRef.current) return
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight
    }, [messages])

    useEffect(() => {
        if (!channel) return
        return channel.connect((message) => setMessages((messages) => [...messages, message]))
    }, [channel])

    const getAllUsers = async() => {
        const { data } = await axios.get(BACKEND_API_URL + 'get_all_normal_users/',
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        setOthers(data)

        const userPayload = [
            {
                id: userName,
                data: { name: userName, custom: { initials: userName.substring(0,2), avatar: "#9fa7df" } },
            },
            {
                id: data[0]?.email,
                data: { name: data[0]?.email, custom: { initials: data[0]?.email.substring(0,2), avatar: "#2fa7df" } },
            },
        ];
        setManageUser(userPayload);
        setSelectedUser(data[0]?.email)
    }

    const getAllEmployee = async() => {
        const { data } = await axios.get(BACKEND_API_URL + 'get_all_normal_employee/',
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        console.log(data)
        setOthers(data)

        const userPayload = [
            {
                id: userName,
                data: { name: userName, custom: { initials: userName.substring(0,2), avatar: "#9fa7df" } },
            },
            {
                id: data[0]?.email,
                data: { name: data[0]?.email, custom: { initials: data[0]?.email.substring(0,2), avatar: "#2fa7df" } },
            },
        ];
        setManageUser(userPayload);
        setSelectedUser(data[0]?.email)
    }

    const selectUser = (email:string) => {
        setSelectedUser(email)
        setMessages([])
        if(manageUser.length == 0) {
            const userPayload = [
                {
                    id: userName,
                    data: { name: "userName", custom: { initials: userName.substring(0,2), avatar: "#9fa7df" } },
                },
                {
                    id: email,
                    data: { name: email, custom: { initials: email.substring(0,2), avatar: "#2fa7df" } },
                },
            ];
            setManageUser(userPayload);
        }else if(manageUser.length == 2) {
            const userPayload = {
                    id: email,
                    data: { name: email, custom: { initials: email.substring(0,2), avatar: "#2fa7df" } },
            };

            setManageUser([manageUser[0], userPayload]);
        }
    }
    useEffect(() => {
        const userRole = localStorage?.getItem('role')
        if(userRole == 'Employee') {
            getAllUsers()
        } else if(userRole == 'User') {
            getAllEmployee()
        }
    }, [])

    useEffect(() => {
        const userRole = localStorage?.getItem('role')
        setRole(userRole)
    }, [])

    useEffect(() => {
        async function initalizeChat() {
            console.log(manageUser)
            const chat = await Chat.init({
                publishKey: 'uuid',
                subscribeKey: 'uuid',
                userId: manageUser[0]?.id? manageUser[0]?.id: 'an',
            })
            const currentUser = await chat.currentUser.update(manageUser[0]?.data)
            console.log("wqdqwdq",manageUser)
            const interlocutor =
                (await chat?.getUser(manageUser[1]?.id)) ||
                (await chat?.createUser(manageUser[1]?.id, manageUser[1]?.data))
            const { channel } = await chat.createDirectConversation({
                user: interlocutor,
                channelData: { name: "Support Channel" },
            })
            setChat(chat)
            setUsers([currentUser, interlocutor])
            setChannel(channel)
        }
        if(manageUser.length > 0) {
            initalizeChat()
        }
    }, [manageUser])

    const renderMessagePart = useCallback((messagePart: MixedTextTypedElement) => {
        if (messagePart.type === "text") {
            return messagePart.content.text
        }
        if (messagePart.type === "plainLink") {
            return <a href={messagePart.content.link}>{messagePart.content.link}</a>
        }
        if (messagePart.type === "textLink") {
            return <a href={messagePart.content.link}>{messagePart.content.text}</a>
        }
        if (messagePart.type === "mention") {
            return <a href={`https://pubnub.com/${messagePart.content.id}`}>{messagePart.content.name}</a>
        }

        return ""
    }, [])

    if (!chat || !channel) return <p className="bg-white">Loading...</p>

    return (
        <div className=".chat d-flex">
            <div className="chat-block">
                <header>
                    <h3>{channel.name}</h3>
                    <h3>{chat.currentUser.name}</h3>
                </header>

                <section className="message-list" ref={messageListRef}>
                    <ol>
                        {messages.map((message) => {
                            const user = users.find((user) => user.id === message.userId)
                            return (
                                <li key={message.timetoken}>
                                    <aside style={{ background: String(user?.custom?.avatar) }}>
                                        {user?.custom?.initials}
                                    </aside>
                                    <article>
                                        <h3>
                                            {user?.name}
                                            <time>
                                                {TimetokenUtils.timetokenToDate(message.timetoken).toLocaleTimeString([], {
                                                    timeStyle: "short",
                                                })}
                                            </time>
                                        </h3>
                                        <p>
                                            {message
                                                .getLinkedText()
                                                .map((messagePart: MixedTextTypedElement, i: number) => (
                                                    <span key={String(i)}>{renderMessagePart(messagePart)}</span>
                                                ))}
                                        </p>
                                    </article>
                                </li>
                            )
                        })}
                    </ol>
                </section>

                <form className="message-input" onSubmit={handleSend}>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Send message"
                    />
                    <input type="submit" value="➔" onClick={handleSend} style={{ color: text && "#de2440" }} />
                </form>
            </div>
            <div className="w-25 bg-white  mx-2">
                <div className="p-2">
                    <div>{role == 'Employee' && <div>Users List</div>} {role == 'Users' && <div>Employees</div>}</div>
                </div>
                {others.length > 0 && others.map((other: any) => {return (<div className={`${selectedUser == other.email? 'px-2 py-4 bg-primary text-white my-2': 'px-2 py-4 bg-grey bg-secondary text-white my-2'}`} style={{cursor:'pointer'}}onClick={() => selectUser(other.email)}>
                    {other.email}
                </div>)})}
            </div>
        </div>
    )
}
