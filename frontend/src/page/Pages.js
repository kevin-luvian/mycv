import PageWrapper from "./extra/PageWrapper";
import Bio from "./Bio";
import Resume from "./Resume";
import Login from "./Login";
import Logout from "./Logout";
import EditPages from "./edit/EditPages";

const Exported = {
    Bio,
    Login,
    Logout,
    Resume,
    Edit: {
        Root: EditPages.EditBio.jsx,
        ...EditPages
    },
    PageWrapper
};

export default Exported;