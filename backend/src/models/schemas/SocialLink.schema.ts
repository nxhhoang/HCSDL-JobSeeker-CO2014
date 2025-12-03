interface SocialLinkConstructor {
  ssn: string
  link: string
}

export default class SocialLink {
  ssn: string
  link: string

  constructor(social: SocialLinkConstructor) {
    this.ssn = social.ssn
    this.link = social.link
  }
}
