import jwt from 'jsonwebtoken';
const generateRefreshToken = (email: string):string => {
    return jwt.sign({ email }, process.env.JWT_REFRESH_SECRET as string, {
        algorithm: "HS256",
        expiresIn: "30 days"
    }); 
}
const generateAccessToken = (email: string,isAdmin:boolean):string => {
    return jwt.sign({ email, isAdmin }, process.env.JWT_ACCESS_SECRET as string, {
        algorithm: "HS256",
        expiresIn: "15m"
    }); 
}
const isAccessTokenValid = (token: string): false|jwt.JwtPayload => {
    try {
        //@ts-ignore
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string, {
            algorithms: ["HS256"]
        });
    } catch (error) {
        return false
    }
}
const isRefreshTokenValid = (token: string): false|jwt.JwtPayload => {
    try {
        //@ts-ignore
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string, {
            algorithms: ["HS256"]
        });
    } catch (error) {
        return false
    }
}
export {generateRefreshToken,generateAccessToken,isAccessTokenValid,isRefreshTokenValid};