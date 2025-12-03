interface JobCategoryConstructor {
  jc_name: string
  speciality?: string
}

export default class JobCategory {
  jc_name: string
  speciality: string

  constructor(category: JobCategoryConstructor) {
    this.jc_name = category.jc_name
    this.speciality = category.speciality || ''
  }
}
