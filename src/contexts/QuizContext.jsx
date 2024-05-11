import React, { createContext, useEffect, useReducer } from "react";

const QuizContext = createContext();
const SECS_PER_QUESTION = 30;
const initialState = {
  questions: [],
  //'loading', 'error','ready','active','finish'
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondRemaining: 10,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceiver":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        secondRemaining: state.questions.length * SECS_PER_QUESTION,
      };

    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };

    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };

    case "restart":
      // return { ...state, status: "ready", index: 0, answer: null, points: 0 };
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
        highscore: state.highscore,
      };
    case "tick":
      return {
        ...state,
        secondRemaining: state.secondRemaining - 1,
        status: state.secondRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("Unknown action");
  }
}

function QuizProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    questions,
    status,
    index,
    answer,
    points,
    highscore,
    secondRemaining,
  } = state;

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );
  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceiver", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);
  return (
    <QuizContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        points,
        highscore,
        secondRemaining,
        numQuestions,
        maxPossiblePoints,
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = React.useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
}

export { QuizProvider, useQuiz };
