let count = 0;

const countEl = document.querySelector('#count');
const statusEl = document.querySelector('#status');
const incrementBtn = document.querySelector('#increment');
const saveBtn = document.querySelector('#save');

incrementBtn.addEventListener('click', () => {
    count++;
    countEl.textContent = count;
});

saveBtn.addEventListener('click', async () => {
    const message = await window.electronAPI.saveData(`Count: ${count}`);
    statusEl.textContent = message;
});
