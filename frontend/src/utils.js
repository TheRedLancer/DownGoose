const utils = {
    zip: function (first, second) {
        let out = []
        for (let i=0; i < first.length; ++i) {
            out.push([first[i], second[i]]);
        }
        return out;
    }
};

export default utils;