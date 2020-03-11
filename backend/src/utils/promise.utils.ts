export class PromiseUtils {
    public static async promiseTimeout(ms, promise): Promise<void> {
        // Create a promise that rejects in <ms> milliseconds
        let timeout = new Promise((resolve, reject) => {
            let id = setTimeout(() => {
                clearTimeout(id);
                // reject('Timed out in '+ ms + 'ms.')
                resolve();
            }, ms);
        })
        
        // Returns a race between our timeout and the passed in promise
        return Promise.race([
            promise,
            timeout
        ]);
    }

}