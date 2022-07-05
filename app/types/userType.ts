import { defaultEmail } from "./defaults/email.types"
import { defaultFisrtName } from "./defaults/firstName.type"
import { defaultLastName } from "./defaults/lastName.type"

declare namespace UserType {
    export interface userCreateFields {
        firstName : defaultFisrtName,
        lastName ?: defaultLastName,
        email : defaultEmail
    }
}
export default UserType

