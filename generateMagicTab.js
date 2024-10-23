const RESET = '\x1b[0m'
const BOLD = '\x1b[1m'
const FONT_RED = '\x1b[31m'
const FONT_GREEN = '\x1b[32m'
const FONT_YELLOW = '\x1b[33m'
const FONT_CYAN = '\x1b[36m'

const ARRAYS_AMOUNT = 10
const ARRAY_LENGTH = 10
const MIN_NUMBER = -100
const MAX_NUMBER = 100

const rows = {}

// Генерация данных и вычисления
for (let i = 1; i <= ARRAYS_AMOUNT; i++) {
  let numbers = Array.from({ length: ARRAY_LENGTH }, () => Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER)

  let minPositive = Infinity
  let replacements = 0
  let countSameSign = 1
  let prevSign = Math.sign(numbers[0]) || 1
  /*
  * Ноль посчитаем за положительное при расчете перестанова, но не будем выводить как наименьшее положительное
  * Если это условие нужно поменять, то это не сложно
  */

  numbers.forEach((currentNumber, j) => {
    // Поиск минимального положительного числа
    if (currentNumber > 0 && currentNumber < minPositive) {
      minPositive = currentNumber
    }

    // Подсчет замен на строках, если 3 и более подряд числа с одинаковым знаком
    let currSign = Math.sign(currentNumber) || 1
    if (currSign === prevSign) {
      countSameSign++
      if (countSameSign >= 3) {
        replacements++
        count = 0
      }
    } else {
      countSameSign = 1
      prevSign = currSign
    }
  })

  // Сохранение строки в объекте
  rows[`row${i}`] = {
    numbers: numbers,
    smallestPositive: minPositive !== Infinity ? minPositive : null,
    replacements: replacements
  }
}

// Поиск минимального числа в массиве и строк с ним
let minNumber = Infinity
let minRows = []

Object.entries(rows).forEach(([key, row]) => {
  row.numbers.forEach((num) => {
    if (num < minNumber) {
      minNumber = num
      minRows = [key]
    } else if (num === minNumber && !minRows.includes(key)) {
      minRows.push(key)
    }
  })
})

// Вывод результатов
const ROW_NUMBER_COLUMN_PADSTART = 3
const NUMBER_COLUMN_PADSTART = 6
const WIDE_COLUMN_PADSTART = 26

// Шапка
console.log(BOLD + FONT_CYAN + `Магическая табличка ${ARRAYS_AMOUNT}x${ARRAY_LENGTH}:` + RESET)
console.log(
  BOLD +
    '№    ' +
    Array.from({ length: ARRAY_LENGTH }, (_, i) => String(i + 1).padStart(NUMBER_COLUMN_PADSTART)).join(' ') +
    '   Наименьшее положительное' + 
    '           Чисел для замены' +
    RESET
)

// Таблица
Object.entries(rows).forEach(([key, row], i) => {
  const isMinRow = minRows.includes(key)
  let rowNumber = (i + 1).toString().padStart(ROW_NUMBER_COLUMN_PADSTART)

  // Окрашиваем минимальные строки и делаем полужирными
  let rowString = row.numbers
    .map((num) => {
      let numStr = num.toString().padStart(NUMBER_COLUMN_PADSTART)
      return isMinRow ? FONT_YELLOW + numStr : numStr
    })
    .join(' ')

  let smallestPositiveStr = row.smallestPositive !== null ? row.smallestPositive.toString() : 'Нет положительных чисел'
  smallestPositiveStr = FONT_GREEN + smallestPositiveStr.padStart(WIDE_COLUMN_PADSTART)

  let replacementsStr = FONT_RED + row.replacements.toString().padStart(WIDE_COLUMN_PADSTART)

  if (isMinRow) {
    rowNumber = BOLD + FONT_YELLOW + rowNumber + '*'
  } else {
    rowNumber = rowNumber + ' '
  }

  console.log(`${rowNumber} ${rowString} ${smallestPositiveStr} ${replacementsStr} ${RESET}`)
})
