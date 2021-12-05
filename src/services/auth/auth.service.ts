import { UserService } from './../user/user.service';
import { hasher } from './../account/account.service';
import { Injectable, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  getLogin(callback?: string, res?: Response): any {
    if (callback) return res.redirect(callback);
    else {
      return res.send('Logged In');
    }
  }
  getSignOut(req: Request) {
    req.logout();
    req.session.destroy((err) => {
      if (err) {
        return err;
      }
    });
    return 200;
  }
  async validateUser(id: string, password: string): Promise<any> {
    const user = await this.userService.findUserById(id);
    if (user && user.password === hasher(password)) {
      const { userid, createdAt, username, UploadedFileSize, lastUploaded } =
        user;
      return {
        userid,
        createdAt,
        username,
        UploadedFileSize,
        lastUploaded,
      };
    } else return null;
  }
}