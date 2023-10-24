import dotenv from 'dotenv'

dotenv.config()

interface Config {
    HttpPort: string
    MongoPort: number
    MongoDatabase: string
    JwtSecret: string
    NodeEnv: string
    Lifetime: string
}

let config: Config = {
    HttpPort: getConf('HTTP_PORT', '6054'),
    MongoPort: parseInt(getConf('MONGO_PORT', '')),
    MongoDatabase: getConf('MONGO_DATABASE', ''),
    JwtSecret: getConf('JWT_SECRET', ''),
    NodeEnv: getConf('NODE_ENV', ''),
    Lifetime: getConf('LIFETIME', '')
}

function getConf(name: string, def: string = ''): string {
    if (process.env[name]) {
        return process.env[name] || ''
    }

    return def
}

export default config
