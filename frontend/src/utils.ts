const utils = {
    zip: function (first: Array<any>, second: Array<any>) {
        let out : Array<[any, any]> = []
        for (let i=0; i < first.length; ++i) {
            out.push([first[i], second[i]]);
        }
        return out;
    }
};

export default utils;