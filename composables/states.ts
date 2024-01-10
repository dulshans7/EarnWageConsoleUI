export const useUserId = () => useState<string>("userId", () => "0")
export const useUserLevel = () => useState<number>("userLevel", () => 0)
export const useLogged = () => useState<boolean>("userLogged", () => false)
export const useUserType = () => useState<number>("userType", () => 0)
export const useUser = () => useState<string>("user", () => "R")
export const useUserRole= () => useState<string>("userRole", () => "0")
//
// @ts-ignore
export const useObject = () => useState<object>("userObject", () => {})
// @ts-ignore
