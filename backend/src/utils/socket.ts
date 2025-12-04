import { verifyAccessToken } from '~/utils/commons'
import { TokenPayload } from '~/models/requests/User.request'
import { UserVerifyStatus } from '~/constants/enums'
import { ErrorWithStatus } from '~/models/Errors'
import { USERS_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import { Server } from 'socket.io'
import Message from '~/models/schemas/Message.schema' // Đã sửa import
import messagesService from '~/services/messages.services'
import { Server as ServerHttp } from 'http'

const initSocket = (httpServer: ServerHttp) => {
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:4000'
    }
  })
  const users: {
    [key: string]: {
      socket_id: string
    }
  } = {}

  io.use(async (socket, next) => {
    const { Authorization } = socket.handshake.auth
    const access_token = Authorization?.split(' ')[1]
    try {
      const decoded_authorization = await verifyAccessToken(access_token)
      const { verify } = decoded_authorization as TokenPayload
      if (verify !== UserVerifyStatus.Verified) {
        throw new ErrorWithStatus({
          message: USERS_MESSAGES.USER_NOT_VERIFIED,
          status: HTTP_STATUS.FORBIDDEN
        })
      }
      // Truyền decoded_authorization vào socket để sử dụng ở các middleware khác
      socket.handshake.auth.decoded_authorization = decoded_authorization
      socket.handshake.auth.access_token = access_token
      next()
    } catch (error) {
      next({
        message: 'Unauthorized',
        name: 'UnauthorizedError',
        data: error
      })
    }
  })
  io.on('connection', (socket) => {
    console.log(`user ${socket.id} connected`)
    const { user_id } = socket.handshake.auth.decoded_authorization as TokenPayload
    users[user_id] = {
      socket_id: socket.id
    }
    socket.use(async (packet, next) => {
      const { access_token } = socket.handshake.auth
      try {
        await verifyAccessToken(access_token)
        next()
      } catch (error) {
        next(new Error('Unauthorized'))
      }
    })

    socket.on('error', (error) => {
      if (error.message === 'Unauthorized') {
        socket.disconnect()
      }
    })

    // Sửa logic send_message để dùng Message
    socket.on('send_message', async (data) => {
      const { receiver_id, sender_id, content } = data.payload
      const receiver_socket_id = users[receiver_id]?.socket_id

      // Khởi tạo Message thay vì Conversation
      // Lưu ý: Đã bỏ ObjectId vì class Message dùng number cho sender_id/receiver_id
      const message = new Message({
        sender_id: sender_id,
        receiver_id: receiver_id,
        content: content
      })

      // Gọi service messages
      const result = await messagesService.insertOne(message)
      // Gán ID trả về từ DB (giả sử DB trả về insertedId)
      ;(message as any)._id = result.insertedId

      socket.emit('send_message_success', {
        payload: message
      })

      if (receiver_socket_id) {
        socket.to(receiver_socket_id).emit('receive_message', {
          payload: message
        })
      }
    })

    socket.on('disconnect', () => {
      delete users[user_id]
      console.log(`user ${socket.id} disconnected`)
    })
  })
}

export default initSocket
