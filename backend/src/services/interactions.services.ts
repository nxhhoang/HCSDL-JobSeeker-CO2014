import databaseService, { sql } from '~/services/database.services'
import { SendFeedbackReqBody, SendMessageReqBody, GetMessagesReqQuery } from '~/models/requests/Interaction.request'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { INTERACTIONS_MESSAGES } from '~/constants/messages'

class InteractionsService {
  // POST /employers/:id/follow (Toggle)
  async followEmployer(user_id: string, employer_id: string) {
    const pool = databaseService.connection

    if (user_id === employer_id)
      throw new ErrorWithStatus({ message: 'Cannot follow yourself', status: HTTP_STATUS.BAD_REQUEST })

    // Check existing follow
    const check = await pool
      .request()
      .input('uid', sql.Int, user_id)
      .input('eid', sql.Int, employer_id)
      .query('SELECT COUNT(*) as count FROM [FOLLOW] WHERE CandidateID = @uid AND EmployerID = @eid')

    if (check.recordset[0].count > 0) {
      // Unfollow
      await pool
        .request()
        .input('uid', sql.Int, user_id)
        .input('eid', sql.Int, employer_id)
        .query('DELETE FROM [FOLLOW] WHERE CandidateID = @uid AND EmployerID = @eid')
      return { message: INTERACTIONS_MESSAGES.UNFOLLOW_SUCCESS, isFollowing: false }
    } else {
      // Follow
      await pool
        .request()
        .input('uid', sql.Int, user_id)
        .input('eid', sql.Int, employer_id)
        .query('INSERT INTO [FOLLOW] (CandidateID, EmployerID) VALUES (@uid, @eid)')
      return { message: INTERACTIONS_MESSAGES.FOLLOW_SUCCESS, isFollowing: true }
    }
  }

  // POST /jobs/:id/feedback
  async sendFeedback(user_id: string, job_id: string, payload: SendFeedbackReqBody) {
    const pool = databaseService.connection

    // Sử dụng Function SQL để kiểm tra quyền Feedback
    // Hàm fn_CanFeedbackJob trả về 1 (True) hoặc 0 (False)
    const checkPermission = await pool
      .request()
      .input('uid', sql.Int, user_id)
      .input('jid', sql.Int, job_id)
      .query(`SELECT dbo.fn_CanFeedbackJob(@uid, @jid) as IsAllowed`)

    if (!checkPermission.recordset[0] || checkPermission.recordset[0].IsAllowed === false) {
      throw new ErrorWithStatus({
        message: 'You can only feedback accepted jobs (Bạn chỉ được đánh giá khi đã được nhận)',
        status: HTTP_STATUS.FORBIDDEN
      })
    }

    // Check duplicate feedback
    const checkDup = await pool
      .request()
      .input('uid', sql.Int, user_id)
      .input('jid', sql.Int, job_id)
      .query('SELECT COUNT(*) as count FROM [FEEDBACK] WHERE ID = @uid AND JobID = @jid')

    if (checkDup.recordset[0].count > 0)
      throw new ErrorWithStatus({ message: 'You have already reviewed this job', status: HTTP_STATUS.CONFLICT })

    await pool
      .request()
      .input('uid', sql.Int, user_id)
      .input('jid', sql.Int, job_id)
      .input('content', sql.NVarChar, payload.content)
      .input('rank', sql.Int, payload.rank)
      .query('INSERT INTO [FEEDBACK] (ID, JobID, Content, Rank) VALUES (@uid, @jid, @content, @rank)')

    return { jobId: job_id, rank: payload.rank, createdAt: new Date() }
  }

  // GET /messages
  async getMessages(user_id: string, query: GetMessagesReqQuery) {
    const pool = databaseService.connection
    // Logic: Get messages where (Sender=Me AND Receiver=Other) OR (Sender=Other AND Receiver=Me)
    const limit = parseInt(query.limit as string) || 20
    const offset = parseInt(query.offset as string) || 0

    const result = await pool
      .request()
      .input('me', sql.Int, user_id)
      .input('other', sql.Int, query.with_user_id)
      .input('limit', sql.Int, limit)
      .input('offset', sql.Int, offset).query(`
            SELECT SenderID, ReceiverID, Content, SendTime, ReadTime
            FROM [MESSAGE]
            WHERE (SenderID = @me AND ReceiverID = @other) OR (SenderID = @other AND ReceiverID = @me)
            ORDER BY SendTime ASC
            OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
        `)

    return result.recordset.map((row: any) => ({
      senderId: row.SenderID,
      content: row.Content,
      createdAt: row.SendTime
    }))
  }

  // POST /messages
  async sendMessage(sender_id: string, payload: SendMessageReqBody) {
    const pool = databaseService.connection
    const transaction = new sql.Transaction(pool)
    try {
      await transaction.begin()
      const req = new sql.Request(transaction)

      // Insert into MESSAGE
      await req
        .input('sender', sql.Int, sender_id)
        .input('receiver', sql.Int, payload.receiverId)
        .input('content', sql.NVarChar, payload.content).query(`
                INSERT INTO [MESSAGE] (SenderID, ReceiverID, Content, SendTime) 
                VALUES (@sender, @receiver, @content, GETDATE())
            `)

      // Insert into SENDMSG (If required by schema logic, usually redundant if MESSAGE has sender/receiver, but following SQL schema)
      // Check if relation exists first? Or just simple insert (might fail on PK dup if PK is (Sender, Receiver))
      // SENDMSG table PK is (SenderID, ReceiverID). It likely represents "User A has messaged User B".
      // Use MERGE or checking existance
      const checkSendMsg = await new sql.Request(transaction)
        .input('s', sql.Int, sender_id)
        .input('r', sql.Int, payload.receiverId)
        .query('SELECT COUNT(*) as c FROM [SENDMSG] WHERE SenderID = @s AND ReceiverID = @r')

      if (checkSendMsg.recordset[0].c === 0) {
        await new sql.Request(transaction)
          .input('s', sql.Int, sender_id)
          .input('r', sql.Int, payload.receiverId)
          .query('INSERT INTO [SENDMSG] (SenderID, ReceiverID) VALUES (@s, @r)')
      }

      await transaction.commit()
      return { receiverId: payload.receiverId, content: payload.content, sendTime: new Date() }
    } catch (e) {
      await transaction.rollback()
      throw e
    }
  }

  // GET /notifications
  async getNotifications(user_id: string) {
    const pool = databaseService.connection
    // Assuming 'Timestamp' is used for sorting. No 'IsRead' column in provided SQL schema for NOTIFY table?
    // SQL Schema: NOTIFY (CandidateID, JobID, EmployerID, Content, Title, Timestamp)
    // It seems NOTIFY table structure in provided SQL might be missing 'IsRead' column or it's inferred.
    // API Doc mentions "PUT /notifications/:id/read".
    // I will assume IsRead column exists or skip it for now.
    const result = await pool.request().input('uid', sql.Int, user_id).query(`
            SELECT CandidateID, JobID, EmployerID, Title, Content, Timestamp
            FROM [NOTIFY]
            WHERE CandidateID = @uid -- Assuming notifications are for Candidates mostly based on SQL FK?
            -- Or if Notification system is generic, we need a ReceiverID column. 
            -- Current SQL: CandidateID (FK USER), EmployerID (FK USER). 
            -- This implies notifications are specifically about Job Interactions between Cand and Emp.
            -- If user_id matches CandidateID, show them.
            ORDER BY Timestamp DESC
        `)

    return result.recordset
  }

  // PUT /notifications/:id/read
  // async readNotification(user_id: string, notif_id: string) {
  //   // Need IsRead column or similar mechanism.
  //   // If SQL schema doesn't have it, we can't implement persistent read status without migration.
  //   // Mocking success.
  //   return true
  // }
}

export default new InteractionsService()
