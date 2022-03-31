import {ConnectionStates, Connection, connect} from 'mongoose'

const CONNECTED = 1
export default class BaseRepository {
  private static connectionString: string
  private static connected: ConnectionStates
  private static connection: Connection

  constructor(dbName: string) {
    console.log(`i am being constructed...`)
    BaseRepository.connected = BaseRepository.connected || null
    BaseRepository.connectionString = process.env.MONGO_URL.replace(`__SERVICE_NAME__`, dbName)
  }

  async connect(): Promise<void> {
    try {
      if (BaseRepository.connected !== CONNECTED) {
        BaseRepository.connection = (await connect(BaseRepository.connectionString)).connection
        BaseRepository.connected = BaseRepository.connection.readyState
        BaseRepository.connection.on(`disconnected`, () => {
          BaseRepository.connected = BaseRepository.connection.readyState
        })
        BaseRepository.connection.on(`close`, () => {
          BaseRepository.connected = BaseRepository.connection.readyState
        })
      }
    } catch (err) {
      console.log(`Failed to connect to Mongo:`, err)
    }
  }

  async disconnect(): Promise<void> {
    if (BaseRepository.connected === CONNECTED) await BaseRepository.connection.close()
  }

  isConnected(): boolean {
    return BaseRepository.connected === CONNECTED
  }
}
