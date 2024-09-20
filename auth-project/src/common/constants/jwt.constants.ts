import { config } from 'dotenv'
config()


export const jwtOpt = {
    secret: process.env.SECRET_JWT,
    global: true,
    signOptions: {
        expiresIn: '30d'
    }
}