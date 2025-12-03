interface SkillConstructor {
  skill_id?: number
  skill_name: string
  s_description?: string
}

export default class Skill {
  skill_id?: number
  skill_name: string
  s_description: string

  constructor(skill: SkillConstructor) {
    this.skill_id = skill.skill_id
    this.skill_name = skill.skill_name
    this.s_description = skill.s_description || ''
  }
}
