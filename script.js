'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANK LIST APP

// Data
const account1 = {
  owner: 'Humayun Ahmed',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2021-11-18T21:31:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2022-01-28T09:15:04.904Z',
    '2022-04-01T10:17:24.185Z',
    '2022-05-08T14:11:59.604Z',
    '2022-10-25T17:01:17.194Z',
    '2022-10-29T23:36:17.929Z',
    '2022-10-30T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'en-GB',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2021-11-01T13:15:33.035Z',
    '2021-11-30T09:48:16.867Z',
    '2021-12-25T06:04:23.907Z',
    '2022-01-25T14:18:46.235Z',
    '2022-02-05T16:33:06.386Z',
    '2022-04-10T14:43:26.374Z',
    '2022-06-25T18:49:59.371Z',
    '2022-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2021-11-01T13:15:33.035Z',
    '2021-11-30T09:48:16.867Z',
    '2021-12-25T06:04:23.907Z',
    '2022-01-25T14:18:46.235Z',
    '2022-02-05T16:33:06.386Z',
    '2022-04-10T14:43:26.374Z',
    '2022-06-25T18:49:59.371Z',
    '2022-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2021-11-18T21:31:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2022-01-28T09:15:04.904Z',
    '2022-04-01T10:17:24.185Z',
    '2022-05-08T14:11:59.604Z',
  ],
  currency: 'EUR',
  locale: 'en-GB',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const currencyFormat = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const formatMovementDate = (data, locale) => {
  const calcDays = (days1, days2) =>
    Math.round(Math.abs(days2 - days1) / (1000 * 60 * 60 * 24));

  const dayPassed = calcDays(new Date(), data);

  if (dayPassed === 0) return 'Today';
  if (dayPassed === 1) return 'Yesterday';
  if (dayPassed <= 7) return `${dayPassed} days ago`;
  else {
    // const day = `${data.getDate()}`.padStart(2, 0);
    // const month = `${data.getMonth() + 1}`.padStart(2, 0);
    // const year = data.getFullYear();
    // return `${day}/${month}/${year}`;

    return new Intl.DateTimeFormat(locale).format(data);
  }
};

const displayMovements = (account, sort = false) => {
  containerMovements.innerHTML = '';

  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const data = new Date(account.movementsDates[i]);

    const displayDate = formatMovementDate(data, account.locale);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${currencyFormat(
          mov,
          account.locale,
          account.currency
        )}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = account => {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = currencyFormat(
    account.balance,
    account.locale,
    account.currency
  );
  // labelBalance.textContent = currencyFormat.format(account.balance);
};

const calcDisplaySummary = account => {
  // InCome
  const income = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = currencyFormat(
    income,
    account.locale,
    account.currency
  );
  // labelSumIn.textContent = currencyFormat.format(income);

  // OutCome
  const outcome = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = currencyFormat(
    Math.abs(outcome),
    account.locale,
    account.currency
  );
  // labelSumOut.textContent = currencyFormat.format(Math.abs(outcome));

  // Interest
  const interest = account.movements
    .filter(move => move > 0)
    .map(move => (move * account.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, move) => acc + move, 0);

  labelSumInterest.textContent = currencyFormat(
    interest,
    account.locale,
    account.currency
  );
  // labelSumInterest.textContent = currencyFormat.format(interest);
};

const createUserName = acc => {
  acc.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

const updateUi = acco => {
  // Display Movements
  displayMovements(acco);
  // Display Balance
  calcDisplayBalance(acco);
  // Display Summery
  calcDisplaySummary(acco);
};

createUserName(accounts);

let currentAccount, timer;

const startLogoutTimer = () => {
  // Set Time to 5 minutes
  let time = 120;

  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In Each Call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 Seconds, Stop timer and Log out User
    if (time == 0) {
      clearInterval(timer);

      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
      containerApp.style.visibility = 'hidden';
    }

    // Decresc 1s
    time--;
  };

  // Call the Timer Every Second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

// Event Handlers
btnLogin.addEventListener('click', e => {
  // PreventDefault Submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and Message
    labelWelcome.textContent = `WellCome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    // Current Date

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // Visible UI
    containerApp.style.opacity = 1;
    containerApp.style.visibility = 'visible';

    // Clear Input Fields
    inputLoginUsername.value = inputLoginPin.value = '';

    inputLoginPin.blur();

    // Start Logout Timer
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    // Update UI
    updateUi(currentAccount);
  }
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    setTimeout(() => {
      // Add Movements
      currentAccount.movements.push(amount);

      // Add Transfer Date and Time
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUi(currentAccount);

      // Reset Timer
      clearInterval(timer);
      timer = startLogoutTimer();
    }, 2500);
  }

  inputLoanAmount.value = '';
});

btnTransfer.addEventListener('click', e => {
  // PreventDefault Submitting
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing The  Transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add Transfer Date and Time
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUi(currentAccount);

    // Reset Timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

btnClose.addEventListener('click', e => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const accIndex = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(accIndex);

    // Delete account
    accounts.splice(accIndex, 1);

    // Welcome text Default
    labelWelcome.textContent = 'Log in to get started';

    // Hide UI
    containerApp.style.opacity = 0;
    containerApp.style.visibility = 'hidden';
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let shored = false;

btnSort.addEventListener('click', e => {
  e.preventDefault();

  displayMovements(currentAccount, !shored);

  shored = !shored;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
