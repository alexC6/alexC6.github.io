// Suppression des champs de valeurs HTML
function clean() {
    let inputN = document.getElementById("order");
    let inputAmax = document.getElementById("amax");
    let inputFreqc = document.getElementById("freqc");
    let inputR1 = document.getElementById("r1");

    document.getElementById("result").innerHTML = "";
    document.getElementById("toHide").style.visibility = "hidden"
    document.getElementById("error").innerHTML = "";

    inputN.value = "";
    inputAmax.value = "";
    inputFreqc.value = "";
    inputR1.value = "";
}

// Ajout de retour chariot pour l'affichage
function br(tId) {
    let newElem = document.createElement('br');

    document.getElementById(tId).appendChild(newElem);
}

// Ajout de texte dans l'affichage
function display(tId, tText) {
    let newText = document.createTextNode(tText);

    document.getElementById(tId).appendChild(newText);
}

// Fonction de calcul des éléments
function compute(tOrder, tAmax, tFc, tUnit, tR1) {
    let ak  = new Array();
    let bk  = new Array();
    let gk  = new Array();
    let l   = new Array();
    let c   = new Array();
    
    let beta    = new Number();
    let gamma   = new Number();
    let i       = new Number();
    let r       = new Number();
    let Rn      = new Number();
    let omegaC  = new Number();

    let n       = new Number(tOrder);
    let amax    = new Number(tAmax);
    let fc      = new Number(tFc);
    let unit    = new Number(tUnit);
    let r1      = new Number(tR1);

    const PI = Math.PI;

    // Passage de la fréquence de coupure en Hz
    fc *= unit;

    // Calcul de l'ensemble des variables nécessaires
    omegaC = 2 * PI * fc;
    beta = Math.log((Math.cosh(amax / 17.37)) / (Math.sinh(amax / 17.37)));
    
    if ((n % 2) == 0) { // Si l'ordre est pair
        r = Math.tanh(beta / 4) * Math.tanh(beta / 4);
    } else { // Si l'ordre est impair
        r = 1;
    }

    Rn = r * r1;

    for (i = 1; i <= n; i++) { // Pour i (k) = 1, ..., n
        ak[i] = Math.sin(((2 * i - 1) * PI) / (2 * n));
    }

    gamma = Math.sinh(beta / (2 * n));

    for (i = 1; i <= n; i++) { // Pour k (i) = 1, ..., n
        bk[i] = (Math.pow(gamma, 2)) + Math.pow(Math.sin((i * PI) / n), 2);
    }

    // Calcul de gk pour k = 1
    gk[1] = (2 * ak[1]) / gamma;

    // Calcul de gk pour k (i) = 2, ..., n
    for (i = 2; i <= n; i++) {
        gk[i] = (4 * ak[i-1] * ak[i]) / (bk[i-1] * gk[i-1]);
    }

    // Calcul des bobines
    for (i = 2; i <= n; i+=2) {
        l[i] = ((r1 * gk[i]) / omegaC);
    }

    // Calcul des capacités de condensateurs
    for (i = 1; i <= n; i+=2) {
        c[i] = gk[i] / (r1 * omegaC);
    }

    displayAll(n, Rn, l, c);
}

// Affichage de tous les résultats
function displayAll(tOrder, tRn, tL, tC) {
    let i = new Number();

    display("result", "Rn = " + tRn.toFixed(2) + " (Ω)");

    br("result");

    for (i = 1; i <= tOrder; i++) {
        let res = new Number();

        if ((i % 2) == 0) {
            res = tL[i];
            display("result", "L" + i + " = " + res.toExponential(3) + " (H)");
        } else {
            res = tC[i];
            display("result", "C" + i + " = " + res.toExponential(3) + " (F)");
        }

        br("result");
    }

    document.getElementById("toHide").style.visibility = "visible";
}

// Fonction appelée par le bouton calculer
function checkValues() {
    // Récupération des valeurs saisies
    let order = document.getElementById("order").value;
    let amax = document.getElementById("amax").value;
    let freqc = document.getElementById("freqc").value;
    let unit = document.getElementById("unit").value;
    let r1 = document.getElementById("r1").value;

    document.getElementById("result").innerHTML = "";

    // Vérification des paramètres
    if ((!isNaN(order) && order > 0)
        && (!isNaN(amax) && amax > 0)
        && (!isNaN(freqc) && freqc > 0)
        && (!isNaN(r1) && r1 > 0)) {
        compute(order, amax, freqc, unit, r1);
    } else {
        clean();
        display("error", "Une ou plusieurs valeurs étaient incorrectes.")
    }
}