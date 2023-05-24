import { collectionGroup, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';


export const getAllEntriesByCurrentUser = async (itemId, onEntriesUpdate) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) {
        return [];
    }

    const entriesQuery = query(
        collectionGroup(db, 'entries'),
        where('uid', '==', currentUser.uid),
        where('itemId', '==', itemId),
        orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(entriesQuery, (snapshot) => {
        const updatedEntries = snapshot.docs.map((doc) => {
            const data = doc.data();
            data.date = data.date.toDate();
            return { id: doc.id, ...data };
        });

        onEntriesUpdate(updatedEntries);
    }, (error) => {
        console.log('Error getting entries collection updates: ', error);
    });

    return unsubscribe;
};
