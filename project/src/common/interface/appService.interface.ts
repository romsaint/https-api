import { Observable } from "rxjs";
import { UserCreateDto } from "src/dto/userCreate.dto";
import { IReturnUser } from "./returnUser.interface";

export interface IAppService {
    registration(userDto: UserCreateDto, profile_image: Express.Multer.File): Promise<Observable<{ confirmationLink: string, email:  string, username:  string }>> 
    login(userDto: Omit<UserCreateDto, 'username'>): Promise<Observable<{userWithoutPassword: IReturnUser, token: string}>>
    allUsers(limit: number, offset: number): Promise<IReturnUser[]> 
    generateUser(count: number): Promise<Observable<{ msg: string }>>
    verifyEmail(token: string): Promise<Observable<{msg: string}>>
}