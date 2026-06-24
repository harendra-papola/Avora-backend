import { JwtPayloadDto } from "../dto/auth/auth.dto";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadDto;
    }
  }
}

export {};