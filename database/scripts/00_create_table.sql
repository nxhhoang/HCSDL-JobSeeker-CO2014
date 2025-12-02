-- 1. Check if Database exists, create if not
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'JobRecruitmentDB')
BEGIN
    CREATE DATABASE JobRecruitmentDB;
    PRINT 'Database JobRecruitmentDB created.';
END
ELSE
BEGIN
    PRINT 'Database JobRecruitmentDB already exists.';
END
GO

USE JobRecruitmentDB;
GO

-- =============================================
-- 2. Main Entity: USERS
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[USER]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[USER] (
        ID INT PRIMARY KEY IDENTITY(1,1), 
        Username NVARCHAR(100) NOT NULL UNIQUE,
        [Password] NVARCHAR(255) NOT NULL,
        Email NVARCHAR(255) NOT NULL UNIQUE,
        PhoneNum NVARCHAR(20),
        Name NVARCHAR(255),
        [Address] NVARCHAR(255),
        ProfilePic NVARCHAR(255),
        Bio NVARCHAR(MAX),
        UserType NVARCHAR(50),
        SSN VARCHAR(20),
        DOB DATE,
        CONSTRAINT CK_User_Type CHECK (UserType IN ('Candidate', 'Employer')),
        CONSTRAINT CK_User_Age CHECK (DATEDIFF(YEAR, DOB, GETDATE()) >= 18)
    );
    PRINT 'Table [USER] created.';
END
GO

-- =============================================
-- 3. Subtype: PERSON
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PERSON]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[PERSON] (
        SSN VARCHAR(20) PRIMARY KEY,
        DOB DATE,
        ID INT,
        FOREIGN KEY (ID) REFERENCES [USER](ID) ON DELETE CASCADE,
        CONSTRAINT CK_Person_Age CHECK (DATEDIFF(YEAR, DOB, GETDATE()) >= 18)
    );
    PRINT 'Table [PERSON] created.';
END
GO

-- =============================================
-- 4. Subtype: COMPANY
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[COMPANY]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[COMPANY] (
        TaxNumber VARCHAR(13) PRIMARY KEY,
        FoundedDate DATE,
        Industry NVARCHAR(100),
        Size NVARCHAR(50),
        Country NVARCHAR(100),
        Website NVARCHAR(255),
        ID INT,
        FOREIGN KEY (ID) REFERENCES [USER](ID) ON DELETE CASCADE,
        CONSTRAINT CK_Company_Taxnumber CHECK (
            TaxNumber LIKE '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'  -- 10 digits
            OR
            TaxNumber LIKE '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'  -- 13 digits
        ),
        CONSTRAINT CK_Company_Website CHECK (
            Website LIKE 'http://%' OR Website LIKE 'https://%'
        ),
        CONSTRAINT CK_Company_FoundedDate CHECK (FoundedDate <= GETDATE())
    );
    PRINT 'Table [COMPANY] created.';
END
GO

-- =============================================
-- 5. Independent Entity: JOB_CATEGORY
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[JOB_CATEGORY]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[JOB_CATEGORY] (
        JCName NVARCHAR(100) PRIMARY KEY, 
        Speciality NVARCHAR(255)
    );
    PRINT 'Table [JOB_CATEGORY] created.';
END
GO

-- =============================================
-- 6. Independent Entity: SKILL
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SKILL]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[SKILL] (
        SkillID INT PRIMARY KEY IDENTITY(1,1),
        SkillName NVARCHAR(100) UNIQUE NOT NULL,
        SDescription NVARCHAR(MAX)
    );
    PRINT 'Table [SKILL] created.';
END
GO

-- =============================================
-- 7. Main Entity: JOB
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[JOB]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[JOB] (
        JobID INT PRIMARY KEY IDENTITY(1,1),
        JobName NVARCHAR(255) NOT NULL,
        PostDate DATETIME DEFAULT GETDATE(),
        ExpireDate DATETIME,
        [Location] NVARCHAR(255),
        Salary DECIMAL(18, 2),
        Quantity INT,
        ExpYear INT,
        [Level] NVARCHAR(50),
        ContractType NVARCHAR(50),
        JobType NVARCHAR(50),
        ID INT,
        FOREIGN KEY (ID) REFERENCES [USER](ID),
        CONSTRAINT CK_Job_ExpireDate CHECK (ExpireDate > PostDate),
        CONSTRAINT CK_Job_Salary CHECK (Salary >= 0),
        CONSTRAINT CK_Job_Quantity CHECK (Quantity >= 0)
    );
    PRINT 'Table [JOB] created.';
END
GO

-- =============================================
-- 8. JOB_HISTORY
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[JOB_HISTORY]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[JOB_HISTORY] (
        HistoryID INT IDENTITY(1,1),
        CandidateID INT,
        Position NVARCHAR(100),
        ComName NVARCHAR(255),
        StartTime DATETIME,
        EndTime DATETIME,
        PRIMARY KEY (CandidateID, HistoryID),
        FOREIGN KEY (CandidateID) REFERENCES [USER](ID),
        CONSTRAINT CK_JobHistory_EndTime CHECK (EndTime > StartTime OR EndTime IS NULL)
    );
    PRINT 'Table [JOB_HISTORY] created.';
END
GO

-- =============================================
-- 9. MESSAGE
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[MESSAGE]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[MESSAGE] (
        SenderID INT,
        ReceiverID INT,
        SendTime DATETIME DEFAULT GETDATE(),
        ReadTime DATETIME,
        Content NVARCHAR(MAX),
        FOREIGN KEY (SenderID) REFERENCES [USER](ID),
        FOREIGN KEY (ReceiverID) REFERENCES [USER](ID)
    );
    PRINT 'Table [MESSAGE] created.';
END
GO

-- =============================================
-- 10. SENDMSG
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SENDMSG]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[SENDMSG] (
        SenderID INT,
        ReceiverID INT,
        PRIMARY KEY (SenderID, ReceiverID),
        FOREIGN KEY (SenderID) REFERENCES [USER](ID),
        FOREIGN KEY (ReceiverID) REFERENCES [USER](ID)
    );
    PRINT 'Table [SENDMSG] created.';
END
GO

-- =============================================
-- 11. SOCIAL_LINK
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SOCIAL_LINK]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[SOCIAL_LINK] (
        SSN VARCHAR(20),
        Link NVARCHAR(255),
        PRIMARY KEY (SSN, Link),
        FOREIGN KEY (SSN) REFERENCES [PERSON](SSN)
    );
    PRINT 'Table [SOCIAL_LINK] created.';
END
GO

-- =============================================
-- 12. FOLLOW
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[FOLLOW]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[FOLLOW] (
        EmployerID INT,
        CandidateID INT,
        PRIMARY KEY (EmployerID, CandidateID),
        FOREIGN KEY (EmployerID) REFERENCES [USER](ID),
        FOREIGN KEY (CandidateID) REFERENCES [USER](ID)
    );
    PRINT 'Table [FOLLOW] created.';
END
GO

-- =============================================
-- 13. APPLY
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[APPLY]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[APPLY] (
        ID INT,
        JobID INT,
        [Date] DATETIME DEFAULT GETDATE(),
        CoverLetter NVARCHAR(255),
        CV NVARCHAR(255),
        [Status] NVARCHAR(50) DEFAULT N'Chờ duyệt',
        PRIMARY KEY (ID, JobID),
        FOREIGN KEY (ID) REFERENCES [USER](ID),
        FOREIGN KEY (JobID) REFERENCES JOB(JobID),
        CONSTRAINT CK_Apply_Status CHECK (Status IS NULL OR Status IN (N'Chờ duyệt', N'Đã nhận', N'Từ chối')),
    );
    PRINT 'Table [APPLY] created.';
END
GO

-- =============================================
-- 14. NOTIFY
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[NOTIFY]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[NOTIFY] (
        CandidateID INT,
        JobID INT,
        EmployerID INT,
        Content NVARCHAR(MAX),
        Title NVARCHAR(255),
        [Timestamp] DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (CandidateID) REFERENCES [USER](ID),
        FOREIGN KEY (EmployerID) REFERENCES [USER](ID),
        FOREIGN KEY (JobID) REFERENCES JOB(JobID) ON DELETE CASCADE
    );
    PRINT 'Table [NOTIFY] created.';
END
GO

-- =============================================
-- 15. REQUIRE
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[REQUIRE]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[REQUIRE] (
        SkillID INT,
        JobID INT,
        PRIMARY KEY (SkillID, JobID),
        FOREIGN KEY (SkillID) REFERENCES SKILL(SkillID),
        FOREIGN KEY (JobID) REFERENCES JOB(JobID)
    );
    PRINT 'Table [REQUIRE] created.';
END
GO

-- =============================================
-- 16. RELATE
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RELATE]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[RELATE] (
        VJobID INT,
        RJobID INT,
        PRIMARY KEY (VJobID, RJobID),
        FOREIGN KEY (VJobID) REFERENCES JOB(JobID),
        FOREIGN KEY (RJobID) REFERENCES JOB(JobID)
    );
    PRINT 'Table [RELATE] created.';
END
GO

-- =============================================
-- 17. IN
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[IN]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[IN] (
        JCName NVARCHAR(100),
        JobID INT,
        PRIMARY KEY (JCName, JobID),
        FOREIGN KEY (JCName) REFERENCES JOB_CATEGORY(JCName),
        FOREIGN KEY (JobID) REFERENCES JOB(JobID)
    );
    PRINT 'Table [IN] created.';
END
GO

-- =============================================
-- 18. OWN
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[OWN]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[OWN] (
        ID INT,
        SkillID INT,
        PRIMARY KEY (ID, SkillID),
        FOREIGN KEY (ID) REFERENCES [USER](ID),
        FOREIGN KEY (SkillID) REFERENCES SKILL(SkillID)
    );
    PRINT 'Table [OWN] created.';
END
GO

-- =============================================
-- 19. FEEDBACK
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[FEEDBACK]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[FEEDBACK] (
        ID INT,
        JobID INT,
        Content NVARCHAR(MAX),
        [Rank] INT,
        PRIMARY KEY (ID, JobID),
        FOREIGN KEY (ID) REFERENCES [USER](ID),
        FOREIGN KEY (JobID) REFERENCES JOB(JobID),
        CONSTRAINT CK_FeedBack_Rank CHECK ([Rank] BETWEEN 1 AND 5)
    );
    PRINT 'Table [FEEDBACK] created.';
END
GO