import axios from 'axios';
const logger = console;

export async function stream(url: string, data: any, target: any) {
    return axios({
        method: data ? 'post' : 'get',
        data,
        url,
        responseType: 'stream',
    })
        .then((res) => {
            return res;
        })
        .catch((error) => {
            if (error.response) {
                logger.error(`error from ${url}`, error.response.status);
                return error.response;
            }
            logger.error(`error from ${url}`, error);

            return undefined;
        })
        .then((res) => {
            if (res && res.headers) {
                if (res.headers['content-type']) {
                    target.setHeader('content-type', res.headers['content-type']);
                }
                return res.data.pipe(target);
            }
            target.status(500).send('unexpected error');

            return undefined;
        });
}

function handleResponse(promise: Promise<any>, url: string, method: string, returnFullResObject = false) {
    return promise.then((res) => {
        logger.debug(`Received ${method} response from ${url}`);
        return returnFullResObject ? res : res.data;
    })
        .catch((error) => {
            logger.error(`error ${method} from ${url}`, error);
            throw error;
        });
}

export async function wget(url: string) {
    logger.debug(`wget request: ${url}`);
    return handleResponse(axios.get(url), url, 'wget')
}

export async function get(url: string, headers?: object, returnFullResObject = false) {
    logger.debug(`get request: ${url}`);
    return handleResponse(axios.get(url, { headers }), url, 'wget', returnFullResObject)
}

export async function del(url: string, headers: object, returnFullResObject = false) {
    logger.debug(`del request: ${url}`);
    return handleResponse(axios.delete(url, { headers }), url, 'del', returnFullResObject)
}

export async function put(url: string, data: any, headers: object, returnFullResObject = false) {
    logger.debug(`put request: ${url}`);
    return handleResponse(axios.put(url, data, { headers }), url, 'put', returnFullResObject)
}

export async function post(url: string, data: any, headers: object, returnFullResObject = false) {
    logger.debug(`post request: ${url}`);
    return handleResponse(axios.post(url, data, { headers }), url, 'post', returnFullResObject)
}