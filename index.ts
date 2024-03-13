const idb = window.indexedDB

interface createCollectionInIndexDBSchema {
    db: string,
    version?: number,
    collection: string
}

interface updateCollectionInIndexDBSchema {
    id?: string | number,
    db: string,
    version?: number,
    collection: string,
    data: any
}

export const createCollectionInIndexDB = (props: createCollectionInIndexDBSchema) => {
    const { db, version, collection } = props
    if (!idb) {
        console.log('Unable to access IndexDB')
        return
    }

    const request = idb.open(db, version || 1)

    request.onerror = (error: any) => {
        console.log(error);
    }

    request.onupgradeneeded = () => {
        const database = request.result

        if (!database.objectStoreNames.contains(collection)) {
            database.createObjectStore(collection, { keyPath: 'id' })
        }

        request.onsuccess = () => {
            console.log(`Database created successfully ${db} ${collection}`);
        }
    }
}

export const updateIndexDB = (props: updateCollectionInIndexDBSchema) => {
    const { db, collection, version, data } = props
    const dbPromise = idb.open(db, version || 1)
    dbPromise.onsuccess = () => {
        const database = dbPromise.result
        const tx = database.transaction(collection, 'readwrite')
        const userData = tx.objectStore(collection)
        const sendingData = userData.put(data)
        sendingData.onsuccess = () => {
            tx.oncomplete = () => {
                database.close()
            }
            console.log('Data successfully store in indexDB');
        }
    }
}

export const getIndexDBData = (props: createCollectionInIndexDBSchema) :any=>  {
    const { db, collection, version } = props
    const dbPromise = idb.open(db, version || 1)
    dbPromise.onsuccess = () => {
        const database = dbPromise.result
        const tx = database.transaction(collection, "readonly")
        const userDataCol = tx.objectStore(collection)
        const userData = userDataCol.getAll()

        userData.onsuccess = (data:any) => {
            if (data?.srcElement?.result) {
                console.log('IndexDB Data' , data?.srcElement?.result);
                return data?.srcElement?.result
            }else{
                return []
            }
        }
    }
}
