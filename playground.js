async function streamFile2(filePath, promiseThunk, bufferSize = 100) {
    return new Promise((resolve, reject) => {
        //create the NodeJS read stream
        const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
        //how many lines should we process at a time?
        let buffer = [];
        stream
            //ensure parsing line by line
            .pipe(split2())
            /*ensure that the next chunk will be processed by the
            stream only when we want to*/
            .pipe(
                through2((chunk, enc, callback) => {
                    //put the chunk along with the other ones
                    buffer.push(chunk.toString());
                    if (buffer.length < bufferSize) {
                        callback(); //next step, no process
                    } else {
                        //call the method that creates a promise, and at the end
                        //just empty the buffer, and process the next chunk
                        promiseThunk(buffer).finally(() => {
                            buffer = [];
                            callback();
                        });
                    }
                }),
            )
            .on('error', error => {
                reject(error);
            })
            .on('finish', () => {
                //any remaining data still needs to be sent
                //resolve the outer promise only when the final batch has completed processing
                if (buffer.length > 0) {
                    promiseThunk(buffer).finally(() => {
                        resolve(true);
                    });
                } else {
                    resolve(true);
                }
            });
    });
}