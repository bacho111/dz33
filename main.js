const output = document.querySelector('#output');

function log(text, type = 'info') {
    console.log(text);
    const line = document.createElement('div');
    line.className = `log-${type}`;
    line.textContent = typeof text === 'object' ? JSON.stringify(text) : text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
}

function delay(value, ms, shouldFail = false) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            shouldFail ? reject(new Error(`Ошибка при обработке: ${value}`)) : resolve(value);
        }, ms);
    });
}

function task1() {
    log('--- ЗАДАЧА 1 (.then / .catch / .finally) ---', 'title');

    delay(1, 500)
        .then((res1) => {
            log(`Шаг 1 выполнен: ${res1}`);
            return delay(res1 + 1, 500, true);
        })
        .then((res2) => {
            log(`Шаг 2 выполнен: ${res2}`);
            return delay(res2 + 1, 500);
        })
        .then((res3) => {
            log(`Шаг 3 выполнен: ${res3}`);
        })
        .catch((err) => {
            log(`Перехвачена ошибка в .catch: ${err.message}`, 'error');
        })
        .finally(() => {
            log('Блок .finally сработал в любом случае.', 'title');
        });
}

async function task2() {
    log('--- ЗАДАЧА 2 (Часть 1: async/await) ---', 'title');

    try {
        const res1 = await delay(1, 500);
        log(`Шаг 1 выполнен: ${res1}`);

        const res2 = await delay(res1 + 1, 500, true);
        log(`Шаг 2 выполнен: ${res2}`);

        const res3 = await delay(res2 + 1, 500);
        log(`Шаг 3 выполнен: ${res3}`);
    } catch (err) {
        log(`Перехвачена ошибка в try/catch: ${err.message}`, 'error');
    } finally {
        log('Блок finally сработал.', 'title');
    }

    log('--- ЗАДАЧА 2 (Часть 2: массив с обработкой внутри цикла) ---', 'title');
    const items = ['A', 'B', 'C', 'D'];
    const results = [];

    for (const item of items) {
        const shouldFail = Math.random() > 0.7;

        try {
            const value = await delay(item, 500, shouldFail);
            results.push({ value, error: null });
        } catch (err) {
            results.push({ value: null, error: err.message });
        }
    }

    log(`Итоговый массив: ${JSON.stringify(results)}`);
}

async function task3() {
    log('--- ЗАДАЧА 3 (all / allSettled / race) ---', 'title');

    try {
        const allResults = await Promise.all([
            delay('A', 300),
            delay('B', 600, true),
            delay('C', 900),
            delay('D', 1200)
        ]);
        log(`Promise.all успех: ${JSON.stringify(allResults)}`);
    } catch (err) {
        log(`Promise.all прервался с ошибкой: ${err.message}`, 'error');
    }

    const settledResults = await Promise.allSettled([
        delay('A', 300),
        delay('B', 600, true),
        delay('C', 900),
        delay('D', 400)
    ]);

    const succeeded = settledResults
        .filter((item) => item.status === 'fulfilled')
        .map((item) => item.value);

    const failed = settledResults
        .filter((item) => item.status === 'rejected')
        .map((item) => item.reason.message);

    log(`Promise.allSettled -> succeeded: ${JSON.stringify(succeeded)}`);
    log(`Promise.allSettled -> failed: ${JSON.stringify(failed)}`, 'error');

    try {
        const raceWinner = await Promise.race([
            delay('Полезные данные', 2000),
            delay('Превышено время ожидания', 500, true)
        ]);
        log(`Promise.race победил: ${raceWinner}`);
    } catch (err) {
        log(`Promise.race завершился ошибкой таймаута: ${err.message}`, 'error');
    }
}

document.querySelector('#btn-task1').addEventListener('click', task1);
document.querySelector('#btn-task2').addEventListener('click', task2);
document.querySelector('#btn-task3').addEventListener('click', task3);
document.querySelector('#btn-clear').addEventListener('click', () => {
    output.innerHTML = '';
});
