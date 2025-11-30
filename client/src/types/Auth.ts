export interface LoginFormData
{
    login: string;
    password: string;
}
export interface RegisterFormData
{
    username: string;
    login: string;
    password: string;
    confirmPassword: string;
}
export interface AuthResponse
{
    token: string;
    user: {
        id: number;
        username: string;
        login: string;
    };
}