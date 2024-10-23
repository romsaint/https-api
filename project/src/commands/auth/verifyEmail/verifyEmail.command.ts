export class VerifyEmailCommand {
    constructor(
        public ip: string,
        public token: string
    ) {}
}