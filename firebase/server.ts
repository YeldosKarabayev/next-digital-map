import { cert, getApps, initializeApp, ServiceAccount } from "firebase-admin/app";
import { Firestore, getFirestore } from "firebase-admin/firestore";

let firestore: Firestore | undefined = undefined;

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY as string);
const currentApp = getApps();
if(currentApp.length <= 0) {
    if(process.env.NEXT_PUBLIC_APP_ENV === 'emulator') {
        process.env["FIRESTORE_EMULATOR_HOST"] = 
            process.env.NEXT_PUBLIC_EMULATOR_FIRESTORE_PATH;
        process.env["FIREBASE_AUTH_EMULATOR_HOST"] =
            process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH;
    }

    const app = initializeApp({
        credential: cert(serviceAccount),
    });
    firestore = getFirestore(app);

} else {
    firestore = getFirestore(currentApp[0]);
}

export { firestore };