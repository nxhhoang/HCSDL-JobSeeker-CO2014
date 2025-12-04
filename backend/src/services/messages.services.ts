import databaseService, { sql } from '~/services/database.services'
import Message from '~/models/schemas/Message.schema'

class MessagesService {
  async insertOne(message: Message) {
    const pool = databaseService.connection

    // Giả định bảng trong SQL tên là MESSAGE và có cột MessageID là IDENTITY(1,1)
    // Nếu bảng thực tế dùng Composite Key (SenderID, ReceiverID, SendTime),
    // bạn cần điều chỉnh lại logic trả về ID.
    const query = `
      INSERT INTO MESSAGE (SenderID, ReceiverID, Content, SendTime, Status)
      OUTPUT INSERTED.MessageID
      VALUES (@sender_id, @receiver_id, @content, @send_time, 'Sent')
    `

    const result = await pool
      .request()
      .input('sender_id', sql.Int, message.sender_id)
      .input('receiver_id', sql.Int, message.receiver_id)
      .input('content', sql.NVarChar, message.content) // NVarChar hỗ trợ tiếng Việt
      .input('send_time', sql.DateTime, message.send_time)
      .query(query)

    // Trả về cấu trúc giống MongoDB driver để tương thích với code socket cũ
    return {
      insertedId: result.recordset[0]?.MessageID || null
    }
  }
}

const messagesService = new MessagesService()
export default messagesService
