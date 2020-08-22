/* eslint-disable import/prefer-default-export */
import Papa from 'papaparse';

export const getData = (data) => {
    // console.log("data", data);
    return data;
}

export const parseData = (url, callBack) => {
    Papa.parse(url, {
        download: true,
        dynamicTyping: true,
        complete: function (results) {
            callBack(results.data);
        }
    });
}
