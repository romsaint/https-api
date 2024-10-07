import { UserDto } from "common-lib-nestjs-https-api/dist";
import {faker} from '@faker-js/faker'
import * as uuid from 'uuid'
import { UserRoles } from "common-lib-nestjs-https-api/dist";
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

    const roles  = [UserRoles.DEFAULT_USER, UserRoles.ADMIN, UserRoles.MODERATOR, UserRoles.PAID_USER]

    const user: UserDto = {
        email,
        id: uuid.v4(),
        password,
        salt,
        role: roles[Math.floor(Math.random() * 4)],
        username: faker.person.fullName(),
        created_at: faker.date.past(),
        updated_at: faker.date.past(),
        profile_image: faker.image.avatar(),
        social_rating: faker.number.float({ multipleOf: 0.25, min: 0, max: 100 })
    };
 
    return user;
}