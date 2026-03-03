import { createRoot } from "react-dom/client";
import App from "./App";
import './index.css';
import UserContext from "./contexts/UserContext";
import StudentContext from "./contexts/StudentContext";

const root = createRoot(document.getElementById('root'));
root.render(
    <StudentContext>
        <UserContext>
            <App />
        </UserContext>
    </StudentContext>
);