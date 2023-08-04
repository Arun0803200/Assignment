import { Authorized, Body, BodyParam, Delete, Get, JsonController, Param, Post, Put, Req, Res } from "routing-controllers";
import { UserService } from "../services/UserService";
import { Admin } from "../models/AdminModel";
import { AdminService } from "../services/AdminService";
import * as jsonwebtoken from 'jsonwebtoken';
import { Token } from "../models/Token";
import { TokenService } from "../services/TokenService";
import { User } from "../models/UserModel";
import { UserRequest } from "./request/UserRequest";
import { Log } from "../models/LogModel";
import { Roles } from "../models/LogModel";
import { LogService } from "../services/LogService";
@JsonController('/single-admin')
export class AdminController {
    constructor(private userService: UserService, private adminService: AdminService, private tokenService: TokenService, private logService: LogService) {}

    // Create user
    @Authorized(['super-admin','admin'])
    @Post()
    public async createAdmin(@Body({validate: true}) userRequest: UserRequest, @Res() response: any, @Req() request: any): Promise<any> {
        const regularExpress: any = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;
        const newUser = new User();
        if (regularExpress.test(userRequest.password) === true) {
            const hashPassword: any = await Admin.hashPassword(userRequest.password);             
            newUser.password = hashPassword;
       } else {
           const errorMessage = {
               status: 0,
               message: 'The password must contain a lowercase letter, an uppercase letter, a number, a special character, minimum 8 characters and maximum 20 character !!'
           }
           return response.status(400).send(errorMessage);
       }
        const findEmail = await this.userService.findOne({
            where: {
                email: userRequest.email
            }
        });
        if (findEmail) {
            const errorResponse = {
                status: 0,
                message: 'This Email already exists. Try giving another email !!'
            };
            return response.status(400).send(errorResponse);
        }
        newUser.email = userRequest.email;
        newUser.name = userRequest.name;
        newUser.role = 3;
        newUser.deleteFlag = 0;

        const createAdmin = await this.userService.create(newUser);
        // Create Log
        const newLog = new Log();
        newLog.name = createAdmin.name;
        newLog.role = Roles[2];
        newLog.action = 'Create',
        newLog.actionBy = request.user.name;
        newLog.actionByRole = request.user.role === 1 ? Roles[0] : Roles[1];
        await this.logService.create(newLog)
        const successResponse = {
            status: 1,
            message: 'Successfully created the User !!',
            data: createAdmin
        };
        const errorResponse = {
            status: 0,
            message: 'Unable to create the User !!'
        }
        return response.status(createAdmin ? 200 : 400).send(createAdmin ? successResponse : errorResponse);
    }

    // Admin Login API
    @Post('/admin-login')
    public async adminLogin(@BodyParam('email') email: string, @BodyParam('password') password: string, @Res() response: any): Promise<any> {
        const findUser: any = await this.adminService.findOne({where: {email}});
        if (!findUser) {
            return response.status(400).send({status: 0, message: 'Invalid username !!'});
        }
        const bcrypt = require('bcrypt');
        const comparePassword = await bcrypt.compare(password, findUser.password);
        if (!comparePassword) {
            return response.status(400).send({status: 0, message: 'Invalid password !!'});
        }
        
        const tokens = await jsonwebtoken.sign({userId: findUser.id, role: 'admin'}, 'fsha%@%xcb754wejh');
        const newToken: any = new Token();
        newToken.token = tokens;
        const createToken = await this.tokenService.create(newToken)

        if (createToken) {
            const successResponse = {
                status: 1,
                message: 'Successfully create the Token',
                token: createToken
            };
            return response.status(200).send(successResponse);
        }
        return response.status(400).send({status: 0, message: 'Invalid login !!'});
    }

    // user update api
    @Authorized(['super-admin','admin'])
    @Put('/:id')
    public async updateUser(@Param('id') id: number, @Body({validate: true}) updateRequest: {name: string, email: string, role: number}, @Res() response, @Req() request: any): Promise<any> {
        const findUser = await this.userService.findOne({where: {id}});
        if (!findUser) {
            return response.status(400).send({status: 0, message: 'Invalid user id !!'});
        }
        findUser.name = updateRequest.name;
        findUser.role = 3;
        findUser.email = updateRequest.email;
        const updateUser = await this.userService.update(findUser.id, findUser);
        // Create Log
        const newLog = new Log();
        newLog.name = updateUser.name;
        newLog.role = Roles[2];
        newLog.action = 'Update',
        newLog.actionBy = request.user.name;
        newLog.actionByRole = request.user.role === 1 ? Roles[0] : Roles[1];
        await this.logService.create(newLog)
        
        const successResponse = {
            status: 0,
            message: 'Successfully update the user data !!',
            data: updateUser
        }
        const errorResponse = {
            status: 0,
            message: 'Unable to update the user data !!'
        }
        return response.status(updateUser ? 200 : 400).send(updateUser ? successResponse : errorResponse);
    }

    // User detail api
    @Get('/:id')
    public async userDetail(@Param('id') id: number, @Res() response: any): Promise<any> {
        const finduser = await this.userService.findOne({where: {id}});
        const successResponse = {
            status: 0,
            message: 'Successfully got the detail of a user !!',
            data: finduser
        }
        const errorResponse = {
            status: 0,
            message: 'Invalid user id !!'
        }
        return response.status(finduser ? 200 : 400).send(finduser ? successResponse : errorResponse);
    }

    // User List api
    @Authorized(['super-admin','admin'])
    @Get()
    @Authorized()
    public async userList(@Res() response: any): Promise<any> {
        const finduser = await this.userService.findAll();
        return response.status(200).send({status: 1, message: 'Successfully got the user list !!', data: finduser});
    }

    // User delete api
    @Authorized(['super-admin','admin'])
    @Delete('/:id')
    public async deleteuser(@Param('id') id: number, @Res() response: any, @Req() request: any): Promise<any> {
        const finduser = await this.userService.findOne({where: {id}});
        if (!finduser) {
            return response.status(400).send({status: 0, message: 'Invalid user id !!'});
        }
        const deleteuser = await this.userService.delete(id);
        // Create Log
        const newLog = new Log();
        newLog.name = finduser.name;
        newLog.role = Roles[2];
        newLog.action = 'Delete',
        newLog.actionBy = request.user.name;
        newLog.actionByRole = request.user.role === 1 ? Roles[0] : Roles[1];
        await this.logService.create(newLog)
        const successResponse = {
            status: 1,
            message: 'Successfully delete an user !!'
        };

        const errorResponse = {
            status: 0,
            message: 'Unable to delet an user !!'
        }
        return response.status(deleteuser ? 200 : 400).send(deleteuser ? successResponse : errorResponse);
    }

}