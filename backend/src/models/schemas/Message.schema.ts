interface MessageConstructor {
  sender_id: number
  receiver_id: number
  send_time?: Date
  read_time?: Date | null
  content?: string
}

export default class Message {
  sender_id: number
  receiver_id: number
  send_time: Date
  read_time: Date | null
  content: string

  constructor(msg: MessageConstructor) {
    this.sender_id = msg.sender_id
    this.receiver_id = msg.receiver_id
    this.send_time = msg.send_time || new Date()
    this.read_time = msg.read_time || null
    this.content = msg.content || ''
  }
}
