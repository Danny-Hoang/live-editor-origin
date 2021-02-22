import Snippet from "common/models/Snippet";
import { useEffect, useState } from "react";
import firebase from "services/firebase";


export const useSnippets = () => {
    const [snippets, setSnippets] = useState<Snippet[]>([]);

    useEffect(() => {
        const classRef = firebase.database().ref('snippets');
        classRef.on('value', function (snapshot: any) {
            let items = snapshot.val();
            const result: Snippet[] = [];
            for (let id in items) {
                if(id) {

                    result.push(new Snippet({
                        id,
                        ...items[id]
                    }))
                }
            }
            setSnippets(result);
        });
    }, [])

    return snippets;
}