// Hesap makinesinin durumunu tutacak değişkenler
const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
};

// Ekranı güncelleme fonksiyonu
function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculator.displayValue;
}

updateDisplay();

// Düğmelere basıldığında ne olacağını belirleyen ana fonksiyon
const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
    const { target } = event;
    const { value } = target;

    // Tıklanan şey bir düğme değilse veya zaten bir işlem varsa çık
    if (!target.matches('button')) {
        return;
    }

    // Tıklanan düğmenin türüne göre işlem yap
    switch (value) {
        case '+':
        case '-':
        case '*':
        case '/':
            handleOperator(value);
            break;
        case '=':
            performCalculation();
            break;
        case '.':
            inputDecimal(value);
            break;
        case 'all-clear':
            resetCalculator();
            break;
        default:
            // Bir sayıya basıldıysa
            if (Number.isInteger(parseFloat(value))) {
                inputDigit(value);
            }
    }

    updateDisplay();
});

// Sayı girişini işleme
function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

// Ondalık nokta girişini işleme
function inputDecimal(dot) {
    // İkinci işlenen bekleniyorsa, "0." olarak başla
    if (calculator.waitingForSecondOperand === true) {
        calculator.displayValue = "0.";
        calculator.waitingForSecondOperand = false;
        return
    }

    // Ekranda zaten bir ondalık nokta yoksa ekle
    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }
}

// Operatör (+, -, *, /) girişini işleme
function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator
    const inputValue = parseFloat(displayValue);

    // İlk işlenen null ise (yani henüz bir sayı girilmediyse)
    if (firstOperand === null) {
        calculator.firstOperand = inputValue;
    } 
    // Zaten bir operatör varsa, önceki işlemi tamamla
    else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);
        
        // Sonucu ekranda göster ve bir sonraki ilk işlenen olarak ayarla
        calculator.displayValue = `${parseFloat(result.toFixed(7))}`; // Virgülden sonra 7 basamakla sınırlama
        calculator.firstOperand = result;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
}

// Gerçek matematiksel hesaplamayı yapan fonksiyon
function calculate(firstOperand, secondOperand, operator) {
    if (operator === '+') {
        return firstOperand + secondOperand;
    } else if (operator === '-') {
        return firstOperand - secondOperand;
    } else if (operator === '*') {
        return firstOperand * secondOperand;
    } else if (operator === '/') {
        if (secondOperand === 0) {
            alert("Sıfıra bölme hatası!");
            return 0; // Hata durumunda 0 döndür
        }
        return firstOperand / secondOperand;
    }

    return secondOperand;
}

// Eşittir (=) tuşuna basıldığında hesaplamayı tetikleme
function performCalculation() {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    if (operator === null || calculator.waitingForSecondOperand) {
        return; // İşlem yapılmadıysa veya sadece ilk sayı girilmişse bir şey yapma
    }

    const result = calculate(firstOperand, inputValue, operator);

    calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
    calculator.firstOperand = null; // Hesaplama bitti, ilk işleneni sıfırla
    calculator.waitingForSecondOperand = true; // Yeni bir hesaplama için hazırla
    calculator.operator = null; // Operatörü sıfırla
}

// AC (All Clear) tuşuna basıldığında hesap makinesini sıfırlama
function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
}