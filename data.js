const quizData = [
    {
        category: "JavaScript Fundamentals",
        questions: [
            {
                questionText: "Which keyword is used to declare a variable that cannot be reassigned?",
                options: ["let", "var", "const", "static"],
                correctAnswer: "const"
            },
            {
                questionText: "What does DOM stand for?",
                options: ["Document Object Model", "Data Object Model", "Document Order Model", "Digital Output Module"],
                correctAnswer: "Document Object Model"
            },
            {
                questionText: "Which of the following is NOT a JavaScript data type?",
                options: ["String", "Boolean", "Number", "Character"],
                correctAnswer: "Character"
            },
            {
                questionText: "What is the result of `typeof null`?",
                options: ["null", "undefined", "object", "string"],
                correctAnswer: "object"
            },
            {
                questionText: "Which method is used to add an element to the end of an array?",
                options: ["push()", "pop()", "shift()", "unshift()"],
                correctAnswer: "push()"
            },
            {
                questionText: "What does `===` operator check for?",
                options: ["Value equality", "Type equality", "Value and type equality", "Reference equality"],
                correctAnswer: "Value and type equality"
            },
            {
                questionText: "How do you write a single-line comment in JavaScript?",
                options: ["// comment", "/* comment */", "<!-- comment -->", "# comment"],
                correctAnswer: "// comment"
            },
            {
                questionText: "Which function is used to parse a JSON string into a JavaScript object?",
                options: ["JSON.stringify()", "JSON.parse()", "JSON.object()", "JSON.toObject()"],
                correctAnswer: "JSON.parse()"
            },
            {
                questionText: "What is an IIFE?",
                options: ["Immediately Invoked Function Expression", "Internally Indexed File Element", "Initial Inline Function Execution", "Instance Invoked Form Element"],
                correctAnswer: "Immediately Invoked Function Expression"
            },
            {
                questionText: "Which array method creates a new array with all elements that pass the test implemented by the provided function?",
                options: ["map()", "forEach()", "filter()", "reduce()"],
                correctAnswer: "filter()"
            }
        ]
    },
    {
        category: "HTML & CSS Basics",
        questions: [
            {
                questionText: "What does HTML stand for?",
                options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyperlink and Text Markup Language", "Home Tool Markup Language"],
                correctAnswer: "Hyper Text Markup Language"
            },
            {
                questionText: "Which HTML tag is used to define an unordered list?",
                options: ["<ol>", "<li>", "<ul>", "<list>"],
                correctAnswer: "<ul>"
            },
            {
                questionText: "What is the correct HTML element for inserting a line break?",
                options: ["<break>", "<lb>", "<br>", "<newline>"],
                correctAnswer: "<br>"
            },
            {
                questionText: "Which CSS property is used to change the text color of an element?",
                options: ["font-color", "text-color", "color", "font-style"],
                correctAnswer: "color"
            },
            {
                questionText: "What does CSS stand for?",
                options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
                correctAnswer: "Cascading Style Sheets"
            },
            {
                questionText: "Which HTML attribute is used to define inline styles?",
                options: ["class", "styles", "font", "style"],
                correctAnswer: "style"
            },
            {
                questionText: "How do you select an element with id 'header' in CSS?",
                options: [".header", "#header", "header", "*header"],
                correctAnswer: "#header"
            },
            {
                questionText: "Which CSS property controls the spacing between lines of text?",
                options: ["letter-spacing", "word-spacing", "line-height", "text-indent"],
                correctAnswer: "line-height"
            },
            {
                questionText: "What is the default value of the `position` property in CSS?",
                options: ["static", "relative", "absolute", "fixed"],
                correctAnswer: "static"
            },
            {
                questionText: "Which HTML tag is used to link an external CSS file?",
                options: ["<style>", "<script>", "<link>", "<css>"],
                correctAnswer: "<link>"
            }
        ]
    },
    {
        category: "Git & Version Control",
        questions: [
            {
                questionText: "What is the command to initialize a new Git repository?",
                options: ["git start", "git new", "git init", "git create"],
                correctAnswer: "git init"
            },
            {
                questionText: "Which command is used to stage changes for a commit?",
                options: ["git commit", "git stage", "git add", "git push"],
                correctAnswer: "git add"
            },
            {
                questionText: "What command shows the current status of your Git repository?",
                options: ["git log", "git status", "git check", "git diff"],
                correctAnswer: "git status"
            },
            {
                questionText: "How do you create a new branch in Git?",
                options: ["git branch <branch-name>", "git new-branch <branch-name>", "git checkout -b <branch-name>", "Both A and C"],
                correctAnswer: "Both A and C"
            },
            {
                questionText: "Which command is used to switch to a different branch?",
                options: ["git switch <branch-name>", "git checkout <branch-name>", "git move <branch-name>", "Both A and B"],
                correctAnswer: "Both A and B"
            },
            {
                questionText: "What is the purpose of `git clone`?",
                options: ["To create a copy of a local repository", "To create a copy of a remote repository", "To merge branches", "To delete a repository"],
                correctAnswer: "To create a copy of a remote repository"
            },
            {
                questionText: "Which command uploads your local commits to a remote repository?",
                options: ["git pull", "git upload", "git send", "git push"],
                correctAnswer: "git push"
            },
            {
                questionText: "What does `HEAD` refer to in Git?",
                options: ["The latest commit of the current branch", "The first commit of the repository", "A specific tag", "The remote repository"],
                correctAnswer: "The latest commit of the current branch"
            },
            {
                questionText: "How can you view the commit history?",
                options: ["git history", "git log", "git show commits", "git timeline"],
                correctAnswer: "git log"
            },
            {
                questionText: "What is a 'merge conflict' in Git?",
                options: ["When two branches have the same name", "When Git cannot automatically combine changes from different commits", "An error during `git push`", "A security vulnerability"],
                correctAnswer: "When Git cannot automatically combine changes from different commits"
            }
        ]
    }
];