import { SnippetData } from "common/types/snippet";
import firebase from "services/firebase";
import faker from 'faker';
import omit from 'lodash/omit';

export default class Snippet {
    constructor(data: Partial<SnippetData>) {
        Object.assign(this, data);
    }

    id: string = '';
    title: string = '';
    content: string = '';
    fileName: string =  '';


    getData() {
        const data = omit(this,['id'] )
        return {...data};
    }

    save(cb?: any) {
        // Get a key for a new Post.
        var key = this.id || faker.random.uuid();
        var updates: any = {};
        const { id, ...others } = this;
        updates['/snippets/' + key] = JSON.parse(JSON.stringify(others))
        return firebase.database().ref().update(updates, (error: any) => {
            if(error) {
                console.log(error)
            }
            cb && cb();
        });
    }

    remove(){
        if (this.id) {
            firebase.database().ref(`/snippets/${this.id}`).remove();
        }
    }
}