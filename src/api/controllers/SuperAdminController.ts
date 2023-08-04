import { Authorized, Body, BodyParam, Delete, Get, JsonController, Param, Post, Put, Res, Req } from "routing-controllers";
import { AdminService } from "../services/AdminService";
import { AdminRequest } from "./request/AdminRequest";
import { Admin } from "../models/AdminModel";
import { SuperAdminService } from "../services/SuperAdminSerice";
import * as jsonwebtoken from 'jsonwebtoken';
import { Token } from "../models/Token";
import { TokenService } from "../services/TokenService";
import { LogService } from "../services/LogService";
import * as path from 'path';
import { LogListFile } from "../models/LogListFileModel";
import { LogListFileService } from "../services/LogListFileService";
const excel = require('exceljs');
import * as moment from 'moment';
import * as fs from 'fs'
import { Log } from "../models/LogModel";
import { Roles } from "../models/LogModel";


@JsonController('/admin')
export class SuperAdminController {
    constructor(private adminService: AdminService, private superAdminService: SuperAdminService, private tokenService: TokenService, private logService: LogService, private logListFileService: LogListFileService) {}

    // Create admin
    @Authorized()
    @Post()
    public async createAdmin(@Body({validate: true}) adminRequest: AdminRequest, @Res() response: any, @Req() request: any): Promise<any> {
        const regularExpress: any = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;
        const newadmin = new Admin();
        if (regularExpress.test(adminRequest.password) === true) {
            const hashPassword: any = await Admin.hashPassword(adminRequest.password);             
            newadmin.password = hashPassword;
       } else {
           const errorMessage = {
               status: 0,
               message: 'The password must contain a lowercase letter, an uppercase letter, a number, a special character, minimum 8 characters and maximum 20 character !!'
           }
           return response.status(400).send(errorMessage);
       }
        const findEmail = await this.adminService.findOne({
            where: {
                email: adminRequest.email
            }
        });
        if (findEmail) {
            const errorResponse = {
                status: 0,
                message: 'This Email already exists. Try giving another email !!'
            };
            return response.status(400).send(errorResponse);
        }
        newadmin.email = adminRequest.email;
        newadmin.name = adminRequest.name;
        newadmin.role = 2;
        const createAdmin = await this.adminService.create(newadmin);

        // Create Log
        const newLog = new Log();
        newLog.name = createAdmin.name;
        newLog.role = Roles[1];
        newLog.action = 'Create';
        newLog.actionBy = request.superAdmin.name;
        newLog.actionByRole = Roles[0];
        await this.logService.create(newLog);

        const successResponse = {
            status: 1,
            message: 'Successfully created the Admin !!',
            data: createAdmin
        };
        const errorResponse = {
            status: 1,
            message: 'Unable to create the Admin !!'
        }
        return response.status(createAdmin ? 200 : 400).send(createAdmin ? successResponse : errorResponse);
    }

    // Super admin Login
    @Post('/super-login')
    public async superAdminLogin(@BodyParam('email') email: string, @BodyParam('password') password: string, @Res() response: any): Promise<any> {
        const findUser: any = await this.superAdminService.findOne({where: {email}});
        if (!findUser) {
            return response.status(400).send({status: 0, message: 'Invalid username !!'});
        }
        const bcrypt = require('bcrypt');
        const comparePassword = await bcrypt.compare(password, findUser.password);
        if (!comparePassword) {
            return response.status(400).send({status: 0, message: 'Invalid password !!'});
        }
        
        const tokens = await jsonwebtoken.sign({userId: findUser.id, role: 'super-admin'}, 'fsha%@%xcb754wejh');
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

    // Admin update api
    @Authorized()
    @Put('/:id')
    public async updateAdmin(@Param('id') id: number, @Body({validate: true}) updateRequest: {name: string, email: string, role: number}, @Res() response, @Req() request: any): Promise<any> {
        const findAdmin = await this.adminService.findOne({where: {id}});
        if (!findAdmin) {
            return response.status(400).send({status: 0, message: 'Invalid admin id !!'});
        }
        findAdmin.name = updateRequest.name;
        findAdmin.role = 2;
        findAdmin.email = updateRequest.email;
        const updateAdmin = await this.adminService.update(findAdmin.id, findAdmin);

       // Create Log
       const newLog = new Log();
       newLog.name = updateAdmin.name;
       newLog.role = Roles[1];
       newLog.action = 'Update';
       newLog.actionBy = request.superAdmin.name;
       newLog.actionByRole = Roles[0];
       await this.logService.create(newLog);

        const successResponse = {
            status: 0,
            message: 'Successfully update the admin data !!',
            data: updateAdmin
        }
        const errorResponse = {
            status: 0,
            message: 'Unable to update the admin data !!'
        }
        return response.status(updateAdmin ? 200 : 400).send(updateAdmin ? successResponse : errorResponse);
    }

    // Admin detail api
    @Authorized()
    @Get('/:id')
    public async adminDetail(@Param('id') id: number, @Res() response: any): Promise<any> {
        const findAdmin = await this.adminService.findOne({where: {id}});
        const successResponse = {
            status: 0,
            message: 'Successfully got the detail of a admin !!',
            data: findAdmin
        }
        const errorResponse = {
            status: 0,
            message: 'Invalid admin id !!'
        }
        return response.status(findAdmin ? 200 : 400).send(findAdmin ? successResponse : errorResponse);
    }

    // Admin List api
    @Get()
    @Authorized()
    public async adminList(@Res() response: any): Promise<any> {
        const findAdmin = await this.adminService.findAll();
        return response.status(200).send({status: 1, message: 'Successfully got the admin list !!', data: findAdmin});
    }

    // Admin delete api
    @Authorized()
    @Delete('/:id')
    public async deleteAdmin(@Param('id') id: number, @Res() response: any, @Req() request: any): Promise<any> {
        const findAdmin = await this.adminService.findOne({where: {id}});
        if (!findAdmin) {
            return response.status(400).send({status: 0, message: 'Invalid admin id !!'});
        }
        const deleteAdmin = await this.adminService.delete(id);

        // Create Log
        const newLog = new Log();
        newLog.name = findAdmin.name;
        newLog.role = Roles[1];
        newLog.action = 'Delete';
        newLog.actionBy = request.superAdmin.name;
        newLog.actionByRole = Roles[0];
        await this.logService.create(newLog);
        const successResponse = {
            status: 1,
            message: 'Successfully delete an admin !!'
        };

        const errorResponse = {
            status: 0,
            message: 'Unable to delet an admin !!'
        }
        return response.status(deleteAdmin ? 200 : 400).send(deleteAdmin ? successResponse : errorResponse);
    }

    // excelData
    public async writeLogFile(): Promise<any> {
        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('log_sheet');
        worksheet.columns = [
          { header: 'name', key: 'name', size: 16, width: 16 },
          { header: 'role', key: 'role', size: 16, width: 16 },
          { header: 'action', key: 'action', size: 16, width: 16 },
          { header: 'actionBy', key: 'actionBy', size: 16, width: 16 },
          { header: 'actionByRole', key: 'actionByRole', size: 16, width: 16 },
          { header: 'createdDate', key: 'createdDate', size: 16, width: 16 },
        ];
        
        // Add borders to cell A1
        worksheet.getCell('A1').border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
        };
      
        const rows = [];
        // Assuming this.logService.findAll() returns an array of data objects
        const findData = await this.logService.findAll();
        for (const data of findData) {
          rows.push([data.name, data.role, data.action, data.actionBy, data.actionByRole, data.createdDate]);
        }
        
        worksheet.addRows(rows);
        
        const fileName = `excel_${Date.now()}.xlsx`;
        const uploadPath = path.join(process.cwd(), 'uploads', fileName);
        await workbook.xlsx.writeFile(uploadPath);
        const newLogListFile = new LogListFile();
        newLogListFile.fileName = fileName;
        await this.logListFileService.create(newLogListFile);
        const currentDateTime = moment();
        const thirtyMinutesAgo = currentDateTime.clone().subtract(30, 'minutes'); // Subtract 30 minutes
        const formattedDateTime = thirtyMinutesAgo.format('YYYY-MM-DD HH:mm:ss');
        const findLogDataFile = await this.logListFileService.find((qb) => {
            qb.where('LogListFile.created_date < :formattedDateTime', {formattedDateTime});
        });
        if (findLogDataFile.length > 0) {
            for (const data of findLogDataFile) {
                const deletePath = path.join(process.cwd(), 'uploads', data.fileName);
                try {
                    await fs.unlinkSync(deletePath);
                  } catch (error) {
                    throw error;
                  }
                await this.logListFileService.delete(data.id);
            }
        }
    }

    @Get('/log/file-list')
    @Authorized()
    public async logList(@Res() response: any): Promise<any> {
        const findLogList = await this.logListFileService.find({order: {
            createdDate: 'DESC'
        },
        take: 1
    });
    const logListObject = findLogList[0];
    const directoryPath = path.join(process.cwd(), 'uploads', logListObject.fileName);
    const jsonValue = await this.xlsxToJson(directoryPath, 'log_sheet');
        return response.status(200).send({status: 1, message: 'Successfully got the log list !!', data: jsonValue});
    }

    // XLSX to Json
    public async xlsxToJson(inputFile: any, sheetName: string): Promise<any> {
        const xlsxToJson = require('xlsx-to-json');
        return new Promise((resolve, reject) => {
        xlsxToJson({
        input: inputFile,
        output: null,
        sheet: sheetName,
        }, (err, result) =>{
            if (err) {
            reject(err);
            } else {
            resolve(result);
            }
        });
        })
    }
}