import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import AddUserForm from "./shared/AddUserForm";


export default function UserForm() {

    return (
        <Dialog>
            <DialogTrigger>Open</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogDescription>
                        <AddUserForm onUserAdded={function (): void {
                            throw new Error("Function not implemented.");
                        } } />
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );

}