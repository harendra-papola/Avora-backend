import * as userRepository from "../../repositories/user/user.repository";
// all the business logic will be here and the controller will call this service and the service will call the repository

export const getUsers = async (userId:number) => {
    // return userRepository.getUsers();
    const users = await userRepository.getUsers(userId);
      if (!users) {
    throw new Error("Users not found");
  }
  return users;
};
