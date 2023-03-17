const form = document.getElementById('form')
const comments = document.querySelector('.comments__container')
const commentsBody = document.querySelectorAll('.comments__body')
let commentsContainer = document.querySelector(`.comments`);


form.addEventListener('submit', function formSend(e) {

    e.preventDefault()

    let error = formValidate(form)
    let formData = new FormData(this)

    if (error === 0) {
        let name = formData.get('name');
        let message = formData.get('textarea');
        let date = formData.get('date');
        let newDate = new Date().toLocaleTimeString('ru')
        let day = ''

        if (!date || new Date().toLocaleDateString('ru') == new Date(date).toLocaleDateString('ru')) {
            date = newDate.slice(0, newDate.length - 3)
            day = 'Сегодня:'
        } else if (new Date(Date.now() - 86400000).toLocaleDateString('ru') == new Date(date).toLocaleDateString('ru')) {
            date = newDate.slice(0, newDate.length - 3)
            day = 'Вчера:'
        } else {
            date = new Date(date).toLocaleDateString('ru')
        }

        comments.insertAdjacentHTML(
            'beforeend',
            `
            <div class="comments__body">
                <h3 class="comments__name">${name}</h3>
                <h3 class="comments__date">${day}${date}</h3>
                <p class="comments__comment">
                    ${message}
                </p>
                <div class="comments__buttons">
                    <button class="comments__btn comments__btn-delete">Удалить</button>
                    <button class="comments__btn comments__btn-like">Лайк</button>
                </div>
            </div>
            `
        )
        form.reset()

    } else {
        console.log('Форма не отправилась');
    }
})



function formValidate(form) {
    let error = 0;
    let reqInputs = document.querySelectorAll('._req')


    for (let i = 0; i < reqInputs.length; i++) {
        const element = reqInputs[i];
        formRemoveError(element)
        if (element.getAttribute('name') === 'name' && !element.value) {
            formAddError(element)
            if (!element.nextElementSibling) {
                element.insertAdjacentHTML(
                    'afterend',
                    `<div class='form__error'>
                    Введите имя
                </div>`
                )
            }
            error++
        }
        if (element.getAttribute('name') === 'textarea' && element.value.length < 5) {
            formAddError(element)
            if (!element.nextElementSibling) {
                element.insertAdjacentHTML(
                    'afterend',
                    `<div class='form__error'>
                        Введите текст, длина которого больше 5 символов
                    </div>`
                )
            }
            error++
        }
        element.addEventListener('focus', function (e) {
            if (element.nextElementSibling) {
                element.nextSibling.remove()
                formRemoveError(element)
            }
        })
    }
    return error
}



function formAddError(input) {
    input.classList.add('_error')
}

function formRemoveError(input) {
    input.classList.remove('_error')
}


const mutationObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
            mutation.addedNodes.forEach(item => {
                item.addEventListener('click', function (e) {
                    if (e.target.classList.contains('comments__btn-delete')) {
                        item.remove()
                    }
                    if (e.target.classList.contains('comments__btn-like')) {
                        e.target.classList.toggle('like')
                    }
                })

            })
        }
    });
});

mutationObserver.observe(commentsContainer, {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
    attributeOldValue: true,
    characterDataOldValue: true
});