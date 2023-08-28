export interface ILoginResult {
    readonly token: string;
}

export interface IJwtPayload {
    readonly sub: string;
    readonly role: string;
}
