export const buildObject = (arr,keyName) => {
    const obj = {};
    let count = 1;
    for (let i = 0; i < arr.length; i++) {
        const object = arr[i];
        obj[`${keyName}${count}`] = object;
        count++;
    };
    return obj;
};
export const envtypekey = "Development";
export const apikey = "development";