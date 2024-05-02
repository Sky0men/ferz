const OCCUPIED = 1;
const FREE = 0;
const ISHERE = -1;
const OUTPUT = 1;
const LOW_N = 4;
const HIGH_N = 11;
let N = 8;
let Current = 0;
let q;

class Queen {
  constructor(N) {
    this.N = N;
    this.columns = new Array(this.N).fill(ISHERE);
    const numberOfDiagonals = 2 * this.N - 1;
    this.diagonals1 = new Array(numberOfDiagonals).fill(FREE);
    this.diagonals2 = new Array(numberOfDiagonals).fill(FREE);
    this.solutions = [];
  }

  run() {
    this.calculate(0);
  }

  calculate(row) {
    for (let column = 0; column < this.N; ++column) {
      if (this.columns[column] >= 0) continue;
      const thisDiag1 = row + column;
      if (this.diagonals1[thisDiag1] === OCCUPIED) continue;
      const thisDiag2 = this.N - 1 - row + column;
      if (this.diagonals2[thisDiag2] === OCCUPIED) continue;
      this.columns[column] = row;
      this.diagonals1[thisDiag1] = OCCUPIED;
      this.diagonals2[thisDiag2] = OCCUPIED;
      if (row === this.N - 1) this.solutions.push([...this.columns]);
      else this.calculate(row + 1);
      this.columns[column] = ISHERE;
      this.diagonals1[thisDiag1] = FREE;
      this.diagonals2[thisDiag2] = FREE;
    }
  }
}

function getline(solution) {
  return solution.map((col, idx) => `(${idx + 1},${col + 1})`).join('');
}

function putline(text) {
  document.getElementById('log_area').value += text + '\n';
}

function main() {
  q = new Queen(N);
  putline(`Board Size: ${q.N}x${q.N}`);
  const start = performance.now();
  q.run();
  const end = performance.now();
  
  putline(`Number of Solutions: ${q.solutions.length}`);
  document.getElementById('show_button').disabled = false;
  Current = 0;
}

function putboard() {
  let s = '<table class="chessboard">\n';
  let color = 'white';
  if (N % 2) color = 'grey';
  for (let i = 1; i <= N; i++) {
    s += '<tr>\n';
    for (let j = 1; j <= N; j++) {
      s += `<td id="board_${i}_${j}" class="${color}">&nbsp;</td>`;
      color = (color === 'white' ? 'grey' : 'white');
    }
    s += '</tr>\n';
    color = (N % 2 === 0 ? (i % 2 ? 'grey' : 'white') : (i % 2 ? 'white' : 'grey'));
  }
  s += '</table>';
  document.getElementById('board_div').innerHTML = s;
}

function run() {
  N = parseInt(document.getElementById('N_select').value);
  if (!isNaN(N) && N >= LOW_N && N <= HIGH_N) {
    document.getElementById('log_area').value = '';
    putboard();
    main();
  } else {
    alert('Please enter a valid number between 4 and 11.');
  }
}

let timeoutId;
let showingSolutions = false;

function showSolution() {
  const solution = q.solutions[Current];
  const reg = /([0-9]+,[0-9]+)/g;
  const fields = getline(solution).match(reg);
  for (let i = 1; i <= N; i++) {
    for (let j = 1; j <= N; j++) {
      document.getElementById(`board_${i}_${j}`).innerHTML = '&nbsp;';
    }
  }
  fields.forEach(field => {
    const [x, y] = field.split(',');
    document.getElementById(`board_${x}_${y}`).innerHTML = '♛';
  });
  // Отображаем номер текущего решения в textarea
  document.getElementById('log_area').value = `Current Solution: ${Current + 1}\n`;
  Current = (Current < q.solutions.length - 1) ? Current + 1 : 0;
  // Показываем следующее решение через 1 секунду (1000 миллисекунд)
  timeoutId = setTimeout(showSolution, 3000);
}

// Функция для остановки показа решений
function stopShowingSolution() {
  clearTimeout(timeoutId);
  showingSolutions = false;
}

function toggleSolution() {
  const button = document.getElementById('show_button');
  if (!showingSolutions) {
    // Если показ решений не активен, запускаем его
    showingSolutions = true;
    button.textContent = 'Остановка';
    showSolution();
  } else {
    // Если показ решений активен, останавливаем его
    stopShowingSolution();
    button.textContent = 'Показать решение';
  }
}