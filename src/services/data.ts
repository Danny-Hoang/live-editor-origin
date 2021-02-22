import { useEffect, useState } from "react";
import firebase from "services/firebase";


export const useData = <T>(refKey: string, cb = (data: any) => {}, deps?: any) => {
    const [data, setData] = useState<T>();

    useEffect(() => {
        const classRef = firebase.database().ref(refKey);
        classRef.on('value', function (snapshot: any) {
            const item = snapshot.val();
            setData(item);
            cb && cb(item);
        });
    }, [deps])

    return data;
}

export const setData = (refKey: string, value: any) => {
    var updates: any = {};
    updates[refKey] = value;
    return firebase.database().ref().update(updates, (error: any) => {
        if (error) {
            console.log(error)
        }
    });
}

 