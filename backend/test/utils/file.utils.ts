const fs = require('fs');

export default class FileHelper {
    public static async print(fileName: String, content: String): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.writeFile(`${__dirname}/../log/${fileName}`, content, (err) => {
                if(err) {
                    console.error(err);
                    return reject(err);
                }
                return resolve();
            }); 
        });
        
    }
}
