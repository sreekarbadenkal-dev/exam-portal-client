import { createBrowserRouter } from "react-router-dom";
import Login from "../components/login/Login.jsx";
import Register from "../components/register/Register.jsx"
import Home from "../home/Home.jsx";
import StudentLogin from "../components/login/StudentLogin.jsx";
import StudentRegister from "../components/register/StudentRegister.jsx";
import StudentHome from "../home/StudentHome.jsx";
import ExamPage from "../components/ExamPage.jsx";
import ResultPage from "../components/ResultPage.jsx";
import ViewResult from "../components/ViewResult.jsx";

const routes=createBrowserRouter(
    [
        
        {
            path:"/",
            element:<Login></Login>
        },
        {
            path:"/login",
            element:<Login></Login>
        },
        {
            path:"/register",
            element:<Register></Register>
        },
        {
            path:"/home",
            element:<Home></Home>
        },
        {
            path:"/studentlogin",
            element:<StudentLogin/>
        },
        {
            path:"/studentregister",
            element:<StudentRegister></StudentRegister>
        },
        {
            path:"/studenthome",
            element:<StudentHome></StudentHome>
        },
        {
            path:"/exampage/:examid",
            element:<ExamPage></ExamPage>
        },
        {
            path:"/resultsummary",
            element:<ResultPage></ResultPage>
        },
        {
            path:"/viewresult/:id",
            element:<ViewResult></ViewResult>
        }

    ]
)

export default routes;