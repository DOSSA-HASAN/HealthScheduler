import { io } from "socket.io-client"

const URL = import.meta.env.MODE === "development" ? 'http://localhost:5123/api' : '/'

export const socket = io(URL, { withCredentials: true, transports: ["websocket"] })

