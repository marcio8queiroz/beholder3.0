export async function doLogin(email, password) {
    if(email === "marcio8queiroz@hotmail.com" && password === "123456")
        return {
    id: 1,
    token: "token"
}
throw new Error("401");
}

export async function doLogout(params) {
    
}