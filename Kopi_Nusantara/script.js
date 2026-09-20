const textHeader = document.getElementsByClassName('text-header')[0];

setTimeout(() => {
    let current = 0;
    const textTask = setInterval(() => {
        current += 0.01;

        textHeader.style.opacity = current;
        textHeader.style.width = current * 100 + '%';

        if(current >= 1){
            clearInterval(textTask);
        }
    }, 10);
}, 500);

[...document.getElementsByClassName('question')]
    .forEach((e, id) => {
        const answer = document.getElementsByClassName('answer')[id];
        answer.hidden = true

        e.addEventListener('click', () => {
            answer.hidden = !answer.hidden
        })
    });