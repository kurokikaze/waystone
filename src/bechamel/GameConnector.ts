// @ts-nocheck
import { SocketOptions } from 'dgram'
import { io, ManagerOptions, Socket } from 'socket.io-client'

export class GameConnector {
  private io?: Socket
  constructor(private readonly address: string) { }

  public connect(gameId: string) {
    const options: Partial<ManagerOptions | SocketOptions> = {
      query: {
        playerHash: gameId,
      },
      autoConnect: true,
      reconnection: true,
    }
    this.io = io(this.address, options)
    return this.io
  }
}