'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Humayun Ahmed',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
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

const currencyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'EUR',
});

const displayMovements = (movements, sort = false) => {
  containerMovements.innerHTML = '';

  const mov = sort ? movements.slice().sort((a, b) => a - b) : movements;

  mov.forEach((movement, i) => {
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${currencyFormat.format(movement)}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = account => {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = currencyFormat.format(account.balance);
};

const calcDisplaySummary = account => {
  // InCome
  const income = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = currencyFormat.format(income);

  // OutCome
  const outcome = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = currencyFormat.format(Math.abs(outcome));

  // Interest
  const interest = account.movements
    .filter(move => move > 0)
    .map(move => (move * account.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, move) => acc + move, 0);

  labelSumInterest.textContent = currencyFormat.format(interest);
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
  displayMovements(acco.movements);
  // Display Balance
  calcDisplayBalance(acco);
  // Display Summery
  calcDisplaySummary(acco);
};

createUserName(accounts);

let currentAccount;

// Event Handlers
btnLogin.addEventListener('click', e => {
  // PreventDefault Submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === parseInt(inputLoginPin.value)) {
    // Display UI and Message
    labelWelcome.textContent = `WellCome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    // Visible UI
    containerApp.style.opacity = 1;
    containerApp.style.visibility = 'visible';

    // Clear Input Fields
    inputLoginUsername.value = inputLoginPin.value = '';

    inputLoginPin.blur();

    // Update UI
    updateUi(currentAccount);
  }
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();

  const amount = parseInt(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    // Add Movements
    currentAccount.movements.push(amount);

    // Update UI
    updateUi(currentAccount);
  }

  inputLoanAmount.value = '';
});

btnTransfer.addEventListener('click', e => {
  // PreventDefault Submitting
  e.preventDefault();

  const amount = parseInt(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    // Update UI
    updateUi(currentAccount);
  }
});

btnClose.addEventListener('click', e => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    parseInt(inputClosePin.value) === currentAccount.pin
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

  displayMovements(currentAccount.movements, !shored);

  shored = !shored;
});

// My Logic
// btnClose.addEventListener('click', e => {
//   e.preventDefault();

//   const closeAcc = accounts.find(
//     acc =>
//       acc.username === inputCloseUsername.value &&
//       acc.pin === parseInt(inputClosePin)
//   );

//   const accIndex = accounts.indexOf(closeAcc);
//   if (accIndex > -1) {
//     accounts.splice(accIndex, 1);
//   }

//   inputCloseUsername.value = inputClosePin.value = '';

//   console.log(accounts);
// });

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/*
let arr = ['a', 'b', 'c', 'd', 'e'];

// SLICE
console.log(arr);
console.log(arr.slice(2));
console.log(arr.slice(-1));
console.log(arr.slice(0, 2));
console.log(arr.slice(0, -2));

// Splice
// console.log(arr.splice(2));
arr.splice(-1);
console.log(arr);
arr.splice(1, 2);
console.log(arr);

// Concat
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['f', 'g', 'h', 'i', 'j'];
const arr3 = ['k', 'l', 'm', 'n', 'o'];
const arr4 = ['k', 'l', 'm', 'n', 'o'];

const arrCon = arr.concat(arr2, arr3, arr4);
const arrCon2 = [...arr, ...arr2, ...arr3, ...arr4];

console.log(arr);
console.log(arr2);
console.log(arrCon);
console.log(arrCon2);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You Deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
  }
}

console.log('---------FOR EACH Method---------');

movements.forEach((movement, i, arr) => {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: Your Deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: Your Withdrew ${Math.abs(movement)}`);
  }
});

// MAP
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach((value, key, map) => {
  console.log(`${key}: ${value}`);
});

console.log('---------SET Method---------');

// SET
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);

console.log(currenciesUnique);

currenciesUnique.forEach((value, _, set) => {
  console.log(`${value}: ${value}`);
});

*/

///////////////////////////////////////
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀z

const juliaData1 = [3, 5, 2, 12, 7];
const kateData1 = [4, 1, 15, 8, 3];
const juliaData2 = [9, 16, 6, 8, 3];
const kateData2 = [10, 5, 6, 1, 4];

const checkDogs = (dogsJulia, dogsKate) => {
  const dogsCorret = dogsJulia.slice();
  dogsCorret.splice(0, 1);
  dogsCorret.splice(-2);

  const dogs = dogsCorret.concat(dogsKate);

  // Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
  dogs.forEach((dog, i) => {
    if (dog > 3) {
      console.log(`Dog number ${i} is an adult, and is ${dog} years old`);
    } else {
      console.log(`Dog number ${i} is still a puppy 🐶`);
    }
  });
};

checkDogs(juliaData1, kateData1);
checkDogs(juliaData2, kateData2);

const bdtTOUsd = 104.17;

// Map Method
const movementsUsd = movements.map(move => {
  return move * bdtTOUsd;
});

const movementsUsdArrow = movements.map(move => move * bdtTOUsd);

console.log(movements);
console.log(movementsUsd);
console.log(movementsUsdArrow);

// For Method
const bdtTOUsdFor = [];
for (const movement of movements) {
  bdtTOUsdFor.push(movement * bdtTOUsd);
}

console.log(bdtTOUsdFor);

// forEach Method
const bdtTOUsdforEach = [];
movements.forEach(move => {
  bdtTOUsdforEach.push(move * bdtTOUsd);
});

console.log(bdtTOUsdforEach);

// const movementMap = movements.map((move, i, arr) => {
//   if (move > 0) {
//     return `Movement ${i + 1}: You Deposited ${move}`;
//   } else {
//     return `Movement ${i + 1}: You Withdrew ${Math.abs(move)}`;
//   }
// });

const movementMap = movements.map(
  (move, i) =>
    `Movement ${i + 1}: You ${move > 0 ? 'Deposited' : 'Withdrew'}  ${Math.abs(
      move
    )}`
);

console.log(movementMap);

console.log(movements);

const deposited = movements.filter(move => {
  return move > 0;
});

console.log(deposited);

const depositedFor = [];
for (const move of movements) {
  if (move > 0) {
    depositedFor.push(move);
  }
}

console.log(depositedFor);

const depositedForEach = [];
movements.forEach(move => {
  if (move > 0) {
    depositedForEach.push(move);
  }
});

console.log(depositedForEach);

const depositedMap = [];
movements.map(move => {
  if (move > 0) {
    depositedMap.push(move);
  }
});
console.log(depositedMap);

console.log(movements);

const withdrawal = movements.filter(move => move < 0);
console.log(withdrawal);

// const find_max = function (nums) {
//   const max_num = 10; // smaller than all other numbers

//   for (const num of nums) {
//     if (num > max_num) {
//       max_num += num;
//     }
//   }
//   // for (const num of nums) {
//   //   if (num > max_num) {
//   //     // (Fill in the missing line here)
//   //     max_num += num;
//   //   }
//   // }
//   return max_num;
// };

// console.log(find_max(12));

const find_max = nums => {
  const maxNum = Number.NEGATIVE_INFINITY;

  for (const num of nums) {
    console.log(num);
  }
};

find_max(12);

console.log(movements);

const balance = movements.reduce(
  (preValue, CurrentValue, currentIndex, arr) => {
    console.log(`Iteration: ${currentIndex}: ${preValue}`);
    return preValue + CurrentValue;
  },
  0
);

console.log(balance);

let balance2 = 0;
for (const move of movements) {
  balance2 += move;
}
console.log(balance);

// Maximum value

const max = movements.reduce((pre, current) => {
  if (pre > current) return pre;
  else return current;
}, movements[0]);

console.log(max);

*/

///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀

const dataAges1 = [5, 2, 4, 1, 15, 8, 3];
const dataAges2 = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = ages => {
  const humanAge = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));

  const adult = humanAge.filter(age => age >= 18);

  console.log(humanAge);
  console.log(adult);

  // const average =
  //   adult.reduce((acc, age) => {
  //     return acc + age;
  //   }, 0) / adult.length;

  const average = adult.reduce((acc, age, i, arr) => {
    return acc + age / arr.length;
  }, 0);

  return average;
};

const avg1 = calcAverageHumanAge(dataAges1);
const avg2 = calcAverageHumanAge(dataAges2);

console.log(avg1, avg2);


const bdtTOUsd = 0.0098;
console.log(movements);

const totalDepositedUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * bdtTOUsd)
  .reduce((acc, mov) => acc + mov, 0);

console.log(totalDepositedUSD);

const firstWithdrawal = movements.find(mov => mov < 0);

console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Steven Thomas Williams');

console.log(account);

const firstWithdrawal = movements.find(move => move > 0);

console.log(movements);
console.log(firstWithdrawal);

const account = accounts.find(acc => acc.owner === 'Steven Thomas Williams');

console.log(account);

console.log(movements);

// Equality
// console.log(movements.includes(-600));

// Some Condition
const anyArr = movements.some(mov => mov <= -651);
// console.log(anyArr);

// Every Condition
const anyArr2 = movements.every(mov => mov < 0);
console.log(anyArr2);

// Separate Call Back
const deposit = mov => mov < 0;

console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));

const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [[4, 5], 6], 7, 8];
console.log(arrDeep.flat(2));

const accountArray = accounts.map(acc => acc.movements);
console.log(accountArray);

const allArray = accountArray.flat();
console.log(allArray);

const overalBalance = allArray.reduce((acc, mov) => {
  return acc + mov;
}, 0);

// Flat
const overalBalance2 = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);

console.log(overalBalance2);

// FlatMap
const overalBalance3 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);

console.log(overalBalance3);


const owner = ['Humayun', 'Sinha', 'onika', 'Tania', 'Hira'];
console.log(owner[3].length);
console.log(owner.sort());

console.log(movements);

// return < 0, A ,B
// return > 0, B,

// Ascending
movements.sort((a, b) => {
  return a - b;
  // if (a > b) return 1;
  // if (a < b) return -1;
});
console.log(movements);

// Descending
movements.sort((a, b) => {
  return b - a;
  // if (a > b) return -1;
  // if (a < b) return 1;
});
console.log(movements);

// Random
movements.sort((a, b) => {
  return 0.5 - Math.random();
});
console.log(movements);


*/

// const arr = [1, 2, 3, 4, 5, 6, 7, 8];
// console.log(arr);

// const arr2 = new Array(1, 2, 3, 4, 5, 6, 7, 8);
// console.log(arr2);

// const x = new Array(8);
// x.fill(1, 3, 5);

// console.log(x);
