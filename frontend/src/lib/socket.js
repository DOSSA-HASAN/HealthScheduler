import { io } from "socket.io-client"

// const URL = 'http://localhost:5123/'
const URL = import.meta.env.MODE === "development" ? 'http://localhost:5123/' : '/'

export const socket = io(URL, { withCredentials: true, transports: ["websocket"] })

