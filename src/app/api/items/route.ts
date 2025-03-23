

import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin"; 

// 🔹 Проверяем, был ли Firebase уже инициализирован

export enum ItemAccsess {
    PUBLIC = "PUBLIC",
    ADMIN = "ADMIN",
}

export type Item = {
    id: string;
    title: string;
    accsess: ItemAccsess;
};

const defaultItems: Item[] = [
    { id: "1", title: "Item 1 Имеет доступ как пользователь", accsess: ItemAccsess.PUBLIC },
    { id: "2", title: "Item 2 Имеет доступ как Администратор", accsess: ItemAccsess.ADMIN },
    { id: "3", title: "Item 3 Имеет доступ как пользователь", accsess: ItemAccsess.PUBLIC },
    { id: "4", title: "Item 4 Имеет доступ как пользователь", accsess: ItemAccsess.PUBLIC },
    { id: "5", title: "Item 5  Имеет доступ как Администратор", accsess: ItemAccsess.ADMIN },
    { id: "6", title: "Item 6 Имеет доступ как пользователь", accsess: ItemAccsess.PUBLIC },
];

export async function GET(request: NextRequest) {
    try {

        if(!db)
            return new NextResponse("Ошибка сервера" , { status: 500 });

        const response = await db.collection("items").get();
        const items = response.docs.map((doc) => doc.data());

        if(items.length <= 0) {
            const batch = db.batch();
            defaultItems.forEach((item) => {
                const ref = db.collection("items").doc(item.id);
                batch.set(ref, item);
            });

            batch.commit();
            return NextResponse.json(defaultItems);

        }

        return NextResponse.json(items);
    } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        return NextResponse.json(
            { message: "Ошибка сервера", error: error },
            { status: 500 }
        );
    }
}


