let mainPanel = document.querySelector('#mainPanel');

//Appending digits to main panel
for(let i= 9; i >= 0; i--) {
    let digit = document.createElement('button');
    digit.textContent = `${i}`
    digit.className = "digit";
    digit.id = `${i}`;
    mainPanel.appendChild(digit);
}

let decimal = document.createElement('button')
decimal.textContent = ".";
decimal.id = "decimal";
mainPanel.appendChild(decimal);

let ans = document.createElement('button');
ans.textContent = "ANS";
ans.id = "ans";
mainPanel.appendChild(ans);