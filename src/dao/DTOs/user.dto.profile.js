export default class UserDTOProfile {
  constructor(user) {
      this.full_name = `${user.first_name} ${user.last_name}`,
      this.first_name = user.first_name,
      this.email = user.email,
      this.age = user.age,
      this.role = user.role,
      this.avatar = user.avatar;
      this.last_connection = user.last_connection;
      this.documents = user.documents;
      this.status = user.status;
  }
}
