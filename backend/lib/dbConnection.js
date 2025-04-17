import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        const res = await mongoose.connect(process.env.DB_URL)
        console.log(res.connection.host)
    } catch (error) {
        console.log("Error occured in dbConnection" + error.message)
        console.log("Error occured in dbConnection" + error.stack)
    }
}