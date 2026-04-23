import { Button } from "@/components/ui/button";
import { handleLogout } from "@/lib/auth-client";

export default function App() {
    return (
        <div>
            <Button onClick={handleLogout}>Logout</Button>
        </div>
    )
}