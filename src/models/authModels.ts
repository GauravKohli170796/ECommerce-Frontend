export interface ICheckUser {
    emaail: string;
    password: string | null
}

export interface ILogInForm {
    email: string;
    password: string;
}

export interface IForgotPasswordForm {
    email: string;
}