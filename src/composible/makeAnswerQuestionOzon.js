import axios from "axios";

export async function makeAnswerQuestionOzon({ apiToken, clientId, item, message }) {
  try {
    await axios.post(
      "https://api-seller.ozon.ru/v1/review/comment/create",
      {
        question_id: item.id,
        sku: item.comment.skuOzon,
        text: item.answer
      },
      {
        headers: {
          'Client-Id': clientId,
          'Api-Key': apiToken,
        }
      }
    );

    item.status = true;
    message.success("Ответ успешно отправлен!");
  } catch (error) {
    console.error("mareAnswerQuestionOzon", error);
    message.error("Ошибка при отправке ответа!");
  }
}
