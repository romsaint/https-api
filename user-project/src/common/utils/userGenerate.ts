import { UserDto } from "src/dto/user.dto";
import {faker} from '@faker-js/faker'
import * as uuid from 'uuid'
import { UserRoles } from "@prisma/client";
import * as CryptoJS from 'crypto-js'

const usedEmails = new Set<string>();

export function generateUser(): UserDto {
    const salt: string = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);

    const password: string = CryptoJS.PBKDF2(faker.string.alpha(10), salt, {
        keySize: 16, 
        iterations: 10000
    }).toString(CryptoJS.enc.Hex);
    
    let email: string;
    do {
        email = faker.internet.email();
    } while (usedEmails.has(email));

    usedEmails.add(email);
    
    const user: UserDto = {
        email,
        id: uuid.v4(),
        password,
        salt,
        role: UserRoles.DEFAULT_USER,
        username: faker.person.fullName(),
        created_at: new Date(),
        updated_at: new Date(),
        profile_image: faker.image.avatar(),
        social_rating: faker.number.float({ multipleOf: 0.25, min: 0, max: 100 })
    };
 
    return user;
}
