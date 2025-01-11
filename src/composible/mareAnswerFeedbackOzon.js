import axios from "axios";

export async function mareAnswerFeedbackOzon({ apiToken, clientId, item, message }) {
  try {
    await axios.post(
      "https://api-seller.ozon.ru/v1/review/comment/create",
      {
        mark_review_as_processed: true,
        parent_comment_id: null,
        review_id: item.id,
        text: item.text
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
    console.error("mareAnswerFeedbackOzon", error);
    message.error("Ошибка при отправке ответа!");
  }
}
