export default class UserDTOCurrent {
  constructor(user) {
    // DTO usado cuando se llama la estrategia current
    this.email = user.email,
    this.role = user.role
  }
}
