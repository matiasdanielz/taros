import { User } from "../user/user";

export interface AuthSession {
    isLogged: boolean;
    sessionInfo: User;
}
