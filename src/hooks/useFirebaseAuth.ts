// "use client";

// import { useState, useEffect } from "react";
// import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
// import { auth } from "@/firebaseConfig";

// export function useFirebaseAuth() {
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     return onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });
//   }, []);

//   const loginWithGoogle = async () => {
//     const provider = new GoogleAuthProvider();
//     await signInWithPopup(auth, provider);
//   };

//   const logout = async () => {
//     await signOut(auth);
//     setUser(null);
//   };

//   return { user, loginWithGoogle, logout };
// }
