import UserModel, { User } from "../model/user";
import { compare } from 'bcrypt';

export interface IResult<T> {
    data?: T;
    error?: string
}

class UserService {

    static async createUser(username: string, password: string): Promise<IResult<User>> {
        const existingUser = await UserModel.getByUsername(username);
        if (existingUser) { return { error: 'Username already exists' } }
        const userCreated = await UserModel.createUser(username, password);
        return {
            data: userCreated
        }
    } 

    static async passIsValid(username: string, password: string): Promise<IResult<User>> {
        // Retrieve user from the database
        const user = await UserModel.getByUsername(username);
        if (!user) { return { error: 'User not found' } }

        // Check if user exists and password is correct
        if (!(await compare(password, user.password))) {
            return { error: 'Invalid email or password' }
        }
        return {
            data: user
        }
    }
}

export default UserService;