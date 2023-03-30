const utils = {
    zip: function <T, G>(first: Array<T>, second: Array<G>) {
        let out: Array<[T, G]> = [];
        for (let i = 0; i < first.length; ++i) {
            out.push([first[i], second[i]]);
        }
        return out;
    },
};

export default utils;
