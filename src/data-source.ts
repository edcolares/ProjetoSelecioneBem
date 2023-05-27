import 'dotenv/config'
import 'reflect-metadata'
import { DataSource } from "typeorm"

const port = process.env.DB_PORT as number | undefined

export const AppDataSource = new DataSource({

    type: 'postgres',

    // CÓDIGO PARA CONEXÃO NA NUVEM - COMENTAR CONEXÃO LOCAL
    url: process.env.DB_URI,

    // CÓDIGO PARA CONEXÃO LOCAL, COMENTAR CONEXÃO NUVEM
    // host: process.env.DB_HOST,
    // port: port,
    // username: process.env.DB_USER,
    // password: process.env.DB_PASS,
    // database: process.env.DB_NAME,

    entities: [`${__dirname}/**/entities/*.{ts,js}`],
    migrations: [`${__dirname}/**/migrations/*.{ts,js}`],
})