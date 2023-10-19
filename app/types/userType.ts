import { ROLE_HR } from "../models/role"
import { defaultEmail } from "./defaults/email.types"
import { defaultFisrtName } from "./defaults/firstName.type"
import { defaultLastName } from "./defaults/lastName.type"
import { defaultPhone } from "./defaults/phone.type"

declare namespace UserType {
    export interface userCreateFields {
        firstName : defaultFisrtName,
        lastName ?: defaultLastName,
        email : defaultEmail,
        phone: defaultPhone,
        role : ROLE_HR,
        password: string,
    }

    export interface loginFields {
        email: defaultEmail,
        password : string
    }
}
export default UserType

