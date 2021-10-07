import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { LoginStatus } from './interfaces/login-status.interface';
import { JwtPayload } from './interfaces/payload.interface';
import { RegistrationStatus } from './interfaces/regisration-status.interface';


@Injectable()
export class AuthService {
    constructor(
    private readonly usersService: UsersService, 
    private readonly jwtService: JwtService,  ) {}


    async validateUser(payload: JwtPayload): Promise<UserDto> {
    const user = await this.usersService.findByPayload(payload);    
    if (!user) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);    
    }    
    return user;  
    }

    async register(userDto: CreateUserDto): 
        Promise<RegistrationStatus> {
            let status: RegistrationStatus = {
                success: true,   
                message: 'user registered',
            };
            try {
                await this.usersService.create(userDto);
            } catch (err) {
                status = {
                    success: false,        
                    message: err,
                };    
            }
            return status;  
        }

    async login(loginUserDto: LoginUserDto): Promise<LoginStatus> {    
      // find user in db    
        const user = await this.usersService.findByLogin(loginUserDto);
        
        // generate and sign token    
        const token = this._createToken(user);
        
        return {
            username: user.username, ...token,    
        };  
    }

    private _createToken({ id,username }: UserDto): any {
        const user: JwtPayload = { id,username };    
        const accessToken = this.jwtService.sign(user);    
        return {
            expiresIn: process.env.EXPIRESIN,
            accessToken,    
        };  
    }

}