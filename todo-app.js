(function () {
    let listTodoItems = [];
    let keyList = '';

    // Создаем и возвращаем заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    // Создаем и возвращаем форму для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.disabled = true;
        button.textContent = 'Добавить дело';

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        input.addEventListener('input', function () {
            if (input.value.trim() !== '') {
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        });

        return {
            form,
            input,
            button,
        };
    }

    // Создаем и возвращаем список элементов
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    // Создаем элементы для списка
    function createTodoItem(paramTodoItem) {
        let item = document.createElement('li');

        // Кнопки помещаем в элемент, который красиво покажет их в одной группе
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        // Устанавливем стили для элемента списка, в также для размещения различных кнопок
        // в его правой части спомощью flex
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'aligin-items-center');
        item.textContent = paramTodoItem.name;
        if (paramTodoItem.done) {
            item.classList.add('list-group-item-success');
        }

        buttonGroup.classList.add('.btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        // Вкладываем кнопки в отдельный элемент, чтобы они обединились в один блок
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        // Добавляем обработчики на кнопки
        doneButton.addEventListener('click', function () {
            item.classList.toggle('list-group-item-success');

            for (const item of listTodoItems) {
                if (item.id === paramTodoItem.id) {
                    item.done = !item.done;
                }
            }

            saveList(listTodoItems, keyList);
        });

        deleteButton.addEventListener('click', function () {
            if (confirm('Вы уверены')) {
                item.remove();

                for (let i = 0; i < listTodoItems.length; i++) {
                    if (listTodoItems[i].id === paramTodoItem.id) {
                        listTodoItems.splice(i, 1);
                    }
                }

                saveList(listTodoItems, keyList);
            }
        });

        // Прилоению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
        return {
            item,
            doneButton,
            deleteButton,
        };
    }

    function getNewId(arr) {
        let max = 0;

        for (const item of arr) {
            if (item.id > max) {
                max = item.id;
            }
        }

        return max + 1;
    }

    function saveList(arr, key) {
        localStorage.setItem(key, JSON.stringify(arr));
    }

    function createTodoApp(container, key, title = 'Список дел', defaultTodo = []) {
        keyList = key;
        let localData = localStorage.getItem(keyList);

        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        if (localData !== null && localData !== '') {
            listTodoItems = JSON.parse(localData);
        } else  {
            listTodoItems = defaultTodo;
            saveList(listTodoItems, keyList);
        }

        for (const item of listTodoItems) {
            let todoItem = createTodoItem(item);
            todoList.append(todoItem.item);
        }
        

        // Браузер создает событие submit на форме по нажатию на Enter или кнопку создания дела
        todoItemForm.form.addEventListener('submit', function (e) {
            // Эта строчка необходима, чтобы предотвратить стандартное поведение браузера
            // В данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
            e.preventDefault();

            // Игнорируем создание элемента, если пользователь ничего не ввел в поле
            if (!todoItemForm.input.value) {
                return;
            }

            let newTodoItem = {
                id: getNewId(listTodoItems),
                name: todoItemForm.input.value,
                done: false,
            };

            let todoItem = createTodoItem(newTodoItem);

            listTodoItems.push(newTodoItem);

            // Создаем и добавляем в список новое дело с названием из поля для ввода
            todoList.append(todoItem.item);

            saveList(listTodoItems, keyList);

            // Обнуляем значение в поле, чтобы не пришлось стирать его вручную
            todoItemForm.input.value = '';
            todoItemForm.button.disabled = true;
        });
    }

    window.createTodoApp = createTodoApp;
})();