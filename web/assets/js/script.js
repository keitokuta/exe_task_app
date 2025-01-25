// タスク管理クラス
class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        this.taskInput = document.getElementById("taskInput");
        this.taskList = document.getElementById("taskList");
        this.addTaskButton = document.getElementById("addTask");

        this.bindEvents();
        this.renderTasks();
    }

    // イベントリスナーの設定
    bindEvents() {
        this.addTaskButton.addEventListener("click", () => this.addTask());
        this.taskInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                this.addTask();
            }
        });
    }

    // タスクの追加
    addTask() {
        const taskText = this.taskInput.value.trim();
        if (taskText) {
            const task = {
                id: Date.now(),
                text: taskText,
            };
            this.tasks.push(task);
            this.saveTasks();
            this.renderTasks();
            this.taskInput.value = "";
        }
    }

    // タスクの編集
    editTask(taskId) {
        const taskElement = document.querySelector(`[data-id="${taskId}"]`);
        const taskTextElement = taskElement.querySelector(".task-text");
        const currentText = taskTextElement.textContent;

        taskTextElement.classList.add("editing");
        taskTextElement.contentEditable = true;
        taskTextElement.focus();

        const saveEdit = () => {
            const newText = taskTextElement.textContent.trim();
            if (newText && newText !== currentText) {
                const taskIndex = this.tasks.findIndex((task) => task.id === taskId);
                if (taskIndex !== -1) {
                    this.tasks[taskIndex].text = newText;
                    this.saveTasks();
                }
            } else {
                taskTextElement.textContent = currentText;
            }
            taskTextElement.classList.remove("editing");
            taskTextElement.contentEditable = false;
        };

        taskTextElement.addEventListener("blur", saveEdit);
        taskTextElement.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                taskTextElement.blur();
            }
        });
    }

    // タスクの削除
    deleteTask(taskId) {
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
        this.saveTasks();
        this.renderTasks();
    }

    // タスクの保存
    saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }

    // タスクの表示
    renderTasks() {
        this.taskList.innerHTML = "";
        this.tasks.forEach((task) => {
            const taskElement = document.createElement("div");
            taskElement.className = "task-item";
            taskElement.dataset.id = task.id;

            const taskText = document.createElement("div");
            taskText.className = "task-text";
            taskText.textContent = task.text;
            taskText.addEventListener("click", () => this.editTask(task.id));

            const deleteButton = document.createElement("button");
            deleteButton.className = "delete-btn";
            deleteButton.textContent = "削除";
            deleteButton.addEventListener("click", () => this.deleteTask(task.id));

            taskElement.appendChild(taskText);
            taskElement.appendChild(deleteButton);
            this.taskList.appendChild(taskElement);
        });
    }
}

// アプリケーションの初期化
document.addEventListener("DOMContentLoaded", () => {
    new TaskManager();
});
