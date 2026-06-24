import jwt from "jsonwebtoken";
import { JwtPayloadDto } from "../dto/auth/auth.dto";

export const generateToken = (data: JwtPayloadDto): string => {

    const secret = process.env.JWT_SECRET;

    if (!secret) { throw new Error( "JWT_SECRET is not defined");}

    const payload = {...data};

    return jwt.sign(payload, secret, {expiresIn: "7d"});
};

export const verifyToken = (
    token: string
): JwtPayloadDto => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }

    return jwt.verify(
        token,
        secret
    ) as JwtPayloadDto;
};