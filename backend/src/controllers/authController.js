async function doLogin(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

    if(email === "marcio8queiroz@hotmail.com" && password === "123456"){
        return res.json({
            id: 1,
            token: "token"
        });
    }
    res.sendStatus(401);
}

async function doLogout(req, res, next) {
    res.send("Logout");
}

export default {
    doLogin,
    doLogout
}