import { NewTeacherForm } from "../Components/Admin/CreateNewTeacher"
import api from "./api-login"

async function CreateNewTeacherService(data:NewTeacherForm){
    const {grades, subject,teacherName,username, } = data

    const newTeacher = {
        grades,subject, teacherName, username 
    }

    try {
        const response = await api.post('/registerteacher', newTeacher)
        console.log(response.status)
    }catch(err:any){
        console.log(err)
        throw err
    }
}

export default CreateNewTeacherService