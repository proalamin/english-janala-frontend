# English Janala - Frontend

This is the Week 2 React frontend for English Janala. It uses Vite, React Router, Axios, and plain CSS.

## Frontend Structure

```text
english-janala-frontend/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── App.jsx
    ├── api/
    │   └── axios.js
    ├── components/
    │   ├── LessonCard.jsx
    │   ├── Navbar.jsx
    │   └── VocabularyCard.jsx
    ├── index.css
    ├── main.jsx
    └── pages/
        ├── AddLesson.jsx
        ├── AddVocabulary.jsx
        ├── EditLesson.jsx
        ├── EditVocabulary.jsx
        ├── Home.jsx
        ├── LessonList.jsx
        ├── LessonVocabulary.jsx
        ├── VocabularyList.jsx
        └── WordDetails.jsx
```

## Frontend Setup Commands

```bash
npm install
npm run dev
```

## Environment Variable

If your backend runs on a different address, create `.env` and set:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

## Pages Included

- Home page
- Lesson list page
- Add lesson page
- Edit lesson page
- Lesson vocabulary page
- All vocabulary page
- Add vocabulary page
- Edit vocabulary page
- Word details page

## Styling

The UI uses a clean green-and-white academic theme, responsive cards, forms, buttons, and messages for loading, success, error, and empty states.
