//jshint esversion:6

exports.getDate = function () {

    const today = new Date();

    const options = {
        weekday: "long",
        day: "numeric",
        month:"long"
    };

    return today.toLocaleDateString("en-US",options);

};

function getDay(){
    let today = new Date();

    let options = {
        weekday: "long"
    };

    let day = today.toLocaleDateString("en-US",options);
    return day;
};