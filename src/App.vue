<script setup>
import axios from "axios";
import {
  Button as AButton,
  Col as ACol,
  ConfigProvider as AConfigProvider,
  Form as AForm,
  FormItem as AFormItem,
  Textarea as ATextarea,
  Row as ARow,
  Select as ASelect,
  Table as ATable,
  Tag as ATag,
  Badge as ABadge,
  Image as AImage,
  Space as ASpace,
  Collapse as ACollapse,
  CollapsePanel as ACollapsePanel,
  message,
} from "ant-design-vue";
import {
  ClockCircleOutlined
} from "@ant-design/icons-vue"
import ruRu from "ant-design-vue/es/locale/ru_RU";
import dayjs from "dayjs";
import ru from "dayjs/locale/ru";
import utc from "dayjs/plugin/utc";

dayjs.locale(ru);
dayjs.extend(utc);

import { useCompanyStore } from "./stores/companyStore.js";
import CompanySelector from "./components/CompanySelector.vue";
import CompanyPanel from "./components/CompanyPanel.vue";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { getFeedbacksWb } from "./composible/getFeedbacksWb.js";

const store = useCompanyStore();

onMounted(() => {
  store.loadFromLocalStorage();

  feedbacksAndQuestions.value = [];
  feedbacksList.value = [];
  questionsList.value = [];

  handleStart();
});

function handleStart() {
  feedbacksGet();
  // questionsGet();

  timerId = setInterval(() => {
    feedbacksGet();
    // questionsGet();
  }, 600000); // 600000 миллисекунд = 10 минут
}

function handleStop() {
  clearInterval(timerId); // Остановить таймер
}

function resetTimer() {
  clearInterval(timerId); // Останавливаем текущий таймер
  timerId = setInterval(() => {
    feedbacksGet();
    // questionsGet();
  }, 600000); // 600000 миллисекунд = 10 минут
}

onUnmounted(() => {
  handleStop();
});

let timerId = null;

const loading = ref(false);
// const feedbacksList = ref({});
const feedbacksList = ref([]);
const questionsList = ref([]);

const columns = ref([
  {
    title: 'Дата / компания',
    dataIndex: 'createdDate',
    key: 'createdDate',
    width: '14%',
  },
  {
    title: 'Имя',
    dataIndex: 'userName',
    key: 'userName',
    width: '10%',
  },
  {
    title: 'Фотографии',
    dataIndex: 'photoLinks',
    key: 'photoLinks',
    width: '10%',
  },
  {
    title: 'Отзыв / Вопрос',
    dataIndex: 'comment',
    key: 'comment',
    width: '25%',
  },
  {
    title: 'Оценка',
    dataIndex: 'productValuation',
    key: 'productValuation',
    width: '8%'
  },
  {
    title: 'Ответ',
    dataIndex: 'answer',
    key: 'answer',
    width: '20%',
  },
  {
    title: 'Статус',
    key: 'status',
    dataIndex: 'status',
    width: '7%',
  },
  {
    title: 'Действие',
    key: 'makeAnswer',
    width: '6%',
  },
]);

const feedbacksAndQuestions = ref([]);

const sortedFeedbacksAndQuestions = computed(() => {
  return [...feedbacksAndQuestions.value].sort((a, b) =>
    dayjs(a.createdDate) - dayjs(b.createdDate)
  );
});

watch([feedbacksList, questionsList], ([newFeedbacks, newQuestions]) => {
  const updateData = ref([]);

  const processNewData = (newData, type) => {
    for (const newItem of newData) {
      const existingItem = feedbacksAndQuestions.value.find(item => item.id === newItem.id);

      if (existingItem) {
        updateData.value.push(existingItem);
      } else {
        updateData.value.push({
          ...newItem,
          type,
          status: false,
          answer: "Ответ еще не сгенерирован"
        });

        // const message = type === 'feedback'
        //   ? `Новый отзыв от *${newItem.userName ? newItem.userName : 'Нет имени'}*`
        //   : 'Новый вопрос';
        //
        // const productValuation = type === "feedback"
        //   ? `Оценка *${getScoreWithSymbol(newItem.productValuation)}*\n`
        //   : '';
        //
        // sendMessageToAllUsers(
        //   `*company*\n` +
        //   `${message}\n` +
        //   `SKU *${newItem.comment.supplierArticle}*\n` +
        //   productValuation +
        //   `Дата *${dayjs(newItem.createdDate).format('DD.MM.YYYY HH:mm')}*`,
        //   newItem.id
        // );
      }
    }
  };

  processNewData(newFeedbacks, 'feedback');
  processNewData(newQuestions, 'question');

  feedbacksAndQuestions.value = updateData.value;
});

function getScoreWithSymbol(value) {
  if (value === 5) return `${value} 💚`;
  else if (value === 4) return `${value} 💛`;
  else return `${value} 💔`;
}

const telegramChatIds = [
  // {
  //   name: "Александр",
  //   id: 514186798,
  // },
  // {
  //   name: "Артём",
  //   id: 428444661,
  // }
];

const messagesUnansweredFeedback = ref([]);

// Функция для отправки сообщения всем пользователям
async function sendMessageToAllUsers(message, feedbackId) {
  if (telegramChatIds.length === 0) {
    console.log('Нет новых пользователей.');
    return;
  }

  for (const chatId of telegramChatIds) {
    try {
      const response = await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: chatId.id,
        text: message,
        parse_mode: 'Markdown'
      });

      messagesUnansweredFeedback.value.push({
        messageId: response.data.result.message_id,
        feedbackId: feedbackId,
        company: "company",
      });
    } catch (error) {
      console.error(`Ошибка при отправке сообщения пользователю с chat_id: ${chatId.id}`, error);
    }
  }
}


// Загрузка отзывов
async function feedbacksGet() {
  loading.value = true;
  const loadingFeedbacks = message.loading('Загрузка отзывов', 0);

  try {
    const allFeedbacks = [];

    for (const company of store.trackingCompanies) {
      if (Object.keys(company.marketplaces).length > 0) {
        for (const marketplace of Object.keys(company.marketplaces)) {
          if (marketplace === 'wb') {
            // const key = `${company.name.replace(/ /g, "_")}_${marketplace}`;
            // const feedbacks = await getFeedbacksWb({
            //   apiToken: company.marketplaces[marketplace].apiToken
            // });
            // feedbacksList.value = { ...feedbacksList.value, [key]: feedbacks };

            const feedbacks = await getFeedbacksWb({
              apiToken: company.marketplaces[marketplace].apiToken,
              companyName: company.name,
              marketplace: marketplace,
            });
            allFeedbacks.push(...feedbacks);

            // feedbacksList.value[`${company.name.replace(/ /g, "_")}_${marketplace}`] = await getFeedbacksWb({
            //   apiToken: company.marketplaces[marketplace].apiToken
            // });
          } else if (marketplace === 'ozon') {

          }
        }
      }
    }

    feedbacksList.value = allFeedbacks;

    loadingFeedbacks();
    loading.value = false;
  } catch (error) {
    loadingFeedbacks();
    loading.value = false;
  }
}

function isValidArray(arr) {
  return arr !== null && Array.isArray(arr) && arr.length > 0;
}

function getColorProductValuation(record) {
  if (record.productValuation === null) {
    return "default";
  } else if (record.productValuation === 5) {
    return "#87d068";
  } else if (record.productValuation === 4) {
    return "gold";
  } else if (record.productValuation <= 3) {
    return "red";
  }
}

// Проверяем, редактируется ли строка
const isEditing = (id) => {
  return editingRow.value.id === id;
};

// Храним информацию о текущей редактируемой строке
const editingRow = ref({id: null, answer: ''});
</script>

<template>
  <a-config-provider :locale="ruRu">
    <a-form layout="vertical">
      <company-selector />
      <company-panel />
    </a-form>

    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; margin-top: 20px;">
      <div style="display: flex; align-items: flex-end;">
        <span style="margin-right: 5px;">Количество неотвеченных отзывов</span>
        <a-badge :count="0" show-zero/>
        <span style="margin: 0 5px;">и вопросов</span>
        <a-badge :count="0" show-zero/>
      </div>
    </div>

    <a-table
      :columns="columns"
      :data-source="sortedFeedbacksAndQuestions"
      :loading="loading"
      row-key="id"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'createdDate'">
<!--          <span v-if="record.createdDate">-->
<!--            {{ dayjs(record.createdDate).format('DD.MM.YYYY HH:mm') }}-->
<!--          </span>-->
          <span v-if="record.createdDate" style="display: block; font-weight: bold;">
            {{ dayjs(record.createdDate).format('DD.MM.YYYY') }}
          </span>
          <span v-if="record.createdDate" style="display: block;">
            {{ dayjs(record.createdDate).format('HH:mm') }}
          </span>
          <a-tag :bordered="false" color="volcano" style="margin: 5px 0;">{{ record.companyName }}</a-tag>
          <a-tag :bordered="false" color="purple">{{ record.marketplace }}</a-tag>
        </template>

        <template v-if="column.key === 'userName'">
          <span v-if="record.userName">
            {{ record.userName }}
          </span>
          <a-tag v-else color="default">
            Нет имени
          </a-tag>
        </template>

        <template v-if="column.key === 'photoLinks'">
          <div
            v-if="isValidArray(record.photoLinks)"
            v-for="image in record.photoLinks"
            class="image__list-item"
          >
            <a-image
              :height="140"
              :src="image.miniSize"
              :preview="false"
            />
          </div>

          <span v-else>
            <a-tag color="default">
             Отсутствуют
            </a-tag>
          </span>
        </template>

        <template v-if="column.key === 'productValuation'">
          <a-tag :color="getColorProductValuation(record)">
            <span v-if="record.productValuation === 5">
              Отлично ({{ record.productValuation }})
            </span>
            <span v-if="record.productValuation === 4">
              Хорошо ({{ record.productValuation }})
            </span>
            <span v-if="record.productValuation === 3">
              Удовлет. ({{ record.productValuation }})
            </span>
            <span v-if="record.productValuation === 2">
              Плохо ({{ record.productValuation }})
            </span>
            <span v-if="record.productValuation === 1">
              Ужасно ({{ record.productValuation }})
            </span>
            <span v-if="!record.productValuation">
              Отсутствует
            </span>
          </a-tag>
        </template>

        <template v-if="column.key === 'comment'">
          <div style="display: flex; flex-direction: column;">
            <p v-if="record.comment.supplierArticle">
              <b>SKU: </b> {{ record.comment.supplierArticle }}
            </p>
            <p v-if="record.comment.pros">
              <b>Достоинства: </b> {{ record.comment.pros }}
            </p>
            <p v-if="record.comment.cons">
              <b>Недостатки: </b> {{ record.comment.cons }}
            </p>
            <p v-if="record.comment.text" :class="{ 'question-text': record.type === 'question' }">
              <b v-if="record.type === 'question'">Вопрос: </b> {{ record.comment.text }}
            </p>
          </div>
        </template>

        <template v-if="column.key === 'answer'">
          <template v-if="isEditing(record.id)">
            <a-textarea
              v-model:value="editingRow.answer"
              auto-size
            />
            <a-space style="margin-top: 10px;">
              <a-button @click="save(record.id)" type="primary">
                Сохранить
              </a-button>
              <a-button @click="cancelEdit">
                Отмена
              </a-button>
            </a-space>
          </template>
          <template v-else>
            <span @click="edit(record)"> <!-- При клике переходим в режим редактирования -->
              {{ record.answer || 'Нет ответа' }}
            </span>
          </template>
        </template>

        <template v-if="column.key === 'status'">
          <a-tag
            :color="record.status ? 'green' : 'volcano'"
          >
            {{ record.status ? 'Ответили' : 'Не ответили' }}
          </a-tag>
        </template>

        <template v-if="column.key === 'makeAnswer'">
          <div style="display: flex; flex-direction: column">
            <a @click="startGenerateAnwser(record.id)" style="margin-bottom: 10px">Сгенерировать</a>

            <a @click="makeAnswer(record.id, record.type)">Ответить</a>
          </div>
        </template>
      </template>
    </a-table>
  </a-config-provider>
</template>

<style scoped>
.image__list-item {
  margin-bottom: 5px;
}

.image__list-item:last-child {
  margin-bottom: 0;
}

.question-text {
  color: #1677ff;
}

.ant-collapse {
  margin-bottom: 20px;
}

.ant-collapse:last-child {
  margin-bottom: 0;
}
</style>
