import IMask from 'imask';

document.querySelectorAll("#app").forEach((page)=>{
    const creditCardNumber = page.querySelector("[name=number]");
    const creditCardValidate = page.querySelector("[name=validate]");
    const creditCardCVV = page.querySelector("[name=code]");

    if (creditCardNumber) {
        new IMask(creditCardNumber, {
            mask: "0000-0000-0000-0000"
        });
    }
    if (creditCardValidate) {
        new IMask(creditCardValidate, {
            mask: "00/00"
        });
    }
    if (creditCardCVV) {
        new IMask(creditCardCVV, {
            mask: "000[0]"
        });
    }
});