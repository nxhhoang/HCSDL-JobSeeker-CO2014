// Bảng REQUIRE: Job yêu cầu Skill
export interface JobRequireSkill {
  skill_id: number
  job_id: number
}

// Bảng OWN: Candidate có Skill
export interface UserOwnSkill {
  user_id: number
  skill_id: number
}

// Bảng IN: Job thuộc Category nào
export interface JobInCategory {
  jc_name: string
  job_id: number
}

// Bảng RELATE: Job liên quan đến Job khác
export interface JobRelation {
  v_job_id: number
  r_job_id: number
}

// Bảng FOLLOW: Candidate follow Employer
export interface Follow {
  employer_id: number
  candidate_id: number
}

// Bảng SENDMSG: Lưu trạng thái gửi (nếu cần thiết ngoài bảng Message)
export interface SendMsg {
  sender_id: number
  receiver_id: number
}
