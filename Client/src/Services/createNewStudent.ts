import { NewStudentForm } from "../Components/Admin/CreateNewStudent"
import api from "./api-login"

async function CreateNewStudentService(data:NewStudentForm){
    const {studentName, username, gender,grade} = data

    const newStudent = {
        studentName,username,gender,grade
    }

    try {
        const response = await api.post('/registerstudent', newStudent)
        console.log(response.status)
    }catch(err:any){
        console.log(err)
        throw err
    }
}

export default CreateNewStudentService