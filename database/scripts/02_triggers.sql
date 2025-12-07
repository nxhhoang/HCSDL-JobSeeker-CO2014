USE JobRecruitmentDB;
GO

-- ko thể apply nếu job đã hết hạn
-- thêm thông báo khi có ứng viên apply
CREATE OR ALTER TRIGGER trg_Apply_Insert
ON [dbo].[APPLY]
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Kiểm tra job hết hạn
    IF EXISTS (
        SELECT 1
        FROM INSERTED i
        JOIN [dbo].[JOB] j ON i.JobID = j.JobID
        WHERE j.ExpireDate < GETDATE()
    )
    BEGIN
        RAISERROR ('Error: You cannot apply for a job that has already expired.', 16, 1);
        ROLLBACK TRANSACTION;
        -- thoát khỏi trigger
        RETURN;
    END
END;
GO

-- thông báo cho những follower của employer khi mà người đó đăng job mới
CREATE OR ALTER TRIGGER trg_NotifyFollowersOnNewJob
ON [dbo].[JOB]
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    -- Chèn dữ liệu vào bảng NOTIFY
    INSERT INTO [dbo].[NOTIFY] (CandidateID, JobID, EmployerID, Title, Content, [Timestamp])
    SELECT 
        f.CandidateID,              -- Người nhận (Candidate đang follow)
        i.JobID,                    -- ID công việc vừa tạo
        i.ID,                       -- Người gửi (Employer)
        N'New Job Alert',           -- Tiêu đề thông báo
        -- Nội dung: "Company ABC vừa đăng tuyển công việc XYZ"
        N'Company ' + u.Name + N' vừa đăng tuyển công việc: ' + i.JobName, 
        GETDATE()                   -- Thời gian hiện tại
    FROM inserted i
    -- 1. Tìm những người đang follow Employer này
    JOIN [dbo].[FOLLOW] f ON i.ID = f.EmployerID
    -- 2. Lấy tên của Employer để ghép vào nội dung tin nhắn
    JOIN [dbo].[USER] u ON i.ID = u.ID;
    PRINT 'Notifications sent to followers of the employer.';
END
GO

USE JobRecruitmentDB;
GO

CREATE OR ALTER TRIGGER trg_CascadeDeleteJob
ON [dbo].[JOB]
INSTEAD OF DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @DeletedJobIDs TABLE (JobID INT);
    INSERT INTO @DeletedJobIDs (JobID) SELECT JobID FROM deleted;

    -- Luôn xóa sạch dữ liệu liên quan để tránh lỗi Foreign Key
    DELETE FROM [dbo].[REQUIRE] WHERE JobID IN (SELECT JobID FROM @DeletedJobIDs);
    DELETE FROM [dbo].[IN] WHERE JobID IN (SELECT JobID FROM @DeletedJobIDs);
    DELETE FROM [dbo].[RELATE] WHERE VJobID IN (SELECT JobID FROM @DeletedJobIDs) OR RJobID IN (SELECT JobID FROM @DeletedJobIDs);
    DELETE FROM [dbo].[FEEDBACK] WHERE JobID IN (SELECT JobID FROM @DeletedJobIDs);
    DELETE FROM [dbo].[NOTIFY] WHERE JobID IN (SELECT JobID FROM @DeletedJobIDs);
    DELETE FROM [dbo].[APPLY] WHERE JobID IN (SELECT JobID FROM @DeletedJobIDs); -- Xóa hết đơn, kể cả Pending

    -- Cuối cùng xóa Job
    DELETE FROM [dbo].[JOB] WHERE JobID IN (SELECT JobID FROM @DeletedJobIDs);
END;
GO


-- Trigger để duy trì số lượng người đã ứng tuyển cho mỗi job
-- Thêm cột để lưu số lượng người đã ứng tuyển hiện tại
ALTER TABLE [dbo].[JOB] 
ADD CurrentApplicants INT DEFAULT 0;
GO

-- Cập nhật lại số liệu cũ cho đúng (nếu đã lỡ có data)
UPDATE J
SET CurrentApplicants = (SELECT COUNT(*) FROM [dbo].[APPLY] WHERE JobID = J.JobID)
FROM [dbo].[JOB] J;
GO

USE JobRecruitmentDB;
GO

CREATE OR ALTER TRIGGER trg_MaintainJobMetrics
ON [dbo].[APPLY]
AFTER INSERT, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- TRƯỜNG HỢP 1: Có ứng viên mới nộp đơn (INSERT)
    -- Logic: Tìm JobID trong bảng inserted và cộng thêm 1 vào CurrentApplicants
    IF EXISTS (SELECT 1 FROM inserted)
    BEGIN
        UPDATE J
        SET J.CurrentApplicants = J.CurrentApplicants + i.cnt
        FROM [dbo].[JOB] J
        JOIN (
            SELECT JobID, COUNT(*) AS cnt
            FROM inserted
            GROUP BY JobID
        ) AS i
            ON J.JobID = i.JobID;
    END


    -- TRƯỜNG HỢP 2: Ứng viên hủy/rút đơn (DELETE)
    -- Logic: Tìm JobID trong bảng deleted và trừ đi 1 khỏi CurrentApplicants
    IF EXISTS (SELECT 1 FROM deleted)
    BEGIN
                UPDATE J
        SET J.CurrentApplicants = J.CurrentApplicants - i.cnt
        FROM [dbo].[JOB] J
        JOIN (
            SELECT JobID, COUNT(*) AS cnt
            FROM deleted
            GROUP BY JobID
        ) AS i
            ON J.JobID = i.JobID;
    END
END;
GO