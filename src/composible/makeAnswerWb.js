import axios from "axios";

// Отправка ответа на отзыв и вопрос
export function makeAnswerWb({ apiToken, clientId, item, message }) {

  const paths = {
    feedback: "https://feedbacks-api.wildberries.ru/api/v1/feedbacks/answer",
    question: "https://feedbacks-api.wildberries.ru/api/v1/questions",
  };

  const data = {
    feedback: {
      id: item.id,
      text: item.answer
    },
    question: {
      id: item.id,
      answer: {
        text: item.answer
      },
      state: "wbRu"
    },
  };

  const method = item.type === "feedback" ? "post" : "patch";
  const path = paths[item.type];
  const payload = data[item.type];

  handleReset({
    onlyTimer: true
  });

  axios[method](path, payload, {
    headers: {
      Authorization: apiToken
    }
  })
    .then(() => {
      item.status = true;
      message.success("Ответ успешно отправлен!");
    })
    .catch((error) => {
      console.error(error);
      message.error("Ошибка при отправке ответа!");
    });
}
