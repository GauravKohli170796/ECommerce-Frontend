export interface ICheckUser {
    emaail: string;
    password: string | null
}
export enum eRole {
    User = "User",
    Admin = "Admin" 
}

export interface IUserDetails{
    email: string;
    role : eRole
}

export interface ILogInForm {
    email: string;
    password: string;
}

export interface IForgotPasswordForm {
    email: string;
}