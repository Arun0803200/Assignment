
import { Connection, getRepository } from "typeorm";
import { Action } from "routing-controllers";
import { AuthSerice } from "./AuthorizationService";
import Container from "typedi";
import { SuperAdmin, User } from "../common/index.entity";
import { Admin } from "../common/index.entity";
export function authorizationChecker(connection: Connection): (action: Action, roles: string[]) => Promise<boolean> | boolean {
    const authService = Container.get<AuthSerice>(AuthSerice);
    return async function innerFunction(action: Action, roles: string[]): Promise<boolean> {
        const user = await authService.checkingAuthorization(action.request);
        if (user === undefined) {
            return false;
        }
        const superAdminSerice = await getRepository(SuperAdmin);
        const adminService = await getRepository(Admin);
        const userService = await getRepository(User);
        if (roles[0] === undefined) {
            action.request.superAdmin = await superAdminSerice.findOne({id: user.userId});
            if (!action.request.superAdmin) {
                return false;
            }
            return true;
        } else if (roles[1] === 'admin' && roles[0] === 'super-admin') {
            action.request.user = await adminService.findOne({id: user.userId});
            if (!action.request.user && user.role === 'super-admin') {
                action.request.user = await superAdminSerice.findOne({id: user.userId});
                if (!action.request.user) {
                        return false;
                    } else if (user.role === 'super-admin') {
                        return true;
                    }
                        return false;
                } else if (user.role === 'admin') {
                    return true;
                } else { // If admin id and super admin id are same then run other part
                    action.request.user = await superAdminSerice.findOne({id: user.userId});
                        if (!action.request.user) {
                            return false;
                            } else if (user.role === 'super-admin') {
                                return true;
                            }
                                return false;
                }
        }

        // user credentials
        if (roles[0] === 'user') {
            action.request.admin = await userService.findOne({id: user.userId});
            if (!action.request.admin) {
                return false;
                }
                return true;
        }
    }
}
