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
import {computed, onMounted, onUnmounted, ref, watch} from "vue";

const store = useCompanyStore();

onMounted(() => {
  store.loadFromLocalStorage();

  feedbacksAndQuestions.value = [];
  feedbacksList.value = [];
  questionsList.value = [];

  startFeedbackInterval();
  startCountdown();
});

onUnmounted(() => {
  // clearInterval(timerId); // Остановить таймер
  clearInterval(feedbackInterval); // Очищаем интервалы при уничтожении компонента
  clearInterval(countdownInterval);
});

function startCountdown() {
  countdownInterval = setInterval(() => {
    remainingTime.value -= 1000;
    if (remainingTime.value <= 0) {
      clearInterval(countdownInterval); // Останавливаем таймер, если время истекло
    }
  }, 1000);
}

function startFeedbackInterval() {
  feedbackInterval = setInterval(() => {
    feedbacksGet();
    startCountdown();
  }, intervalTime);
}

const formattedTime = computed(() => {
  const minutes = Math.floor(remainingTime.value / 60000);
  const seconds = Math.floor((remainingTime.value % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
});

let timerId = null;
let countdownInterval = null;
const intervalTime = 600000; // 10 минут в миллисекундах
const remainingTime = ref(intervalTime); // Оставшееся время для обратного отсчёта
let feedbackInterval = null;

const loading = ref(false);
const feedbacksList = ref([]);
const questionsList = ref([]);

const columns = ref([
  {
    title: 'Дата / компания',
    dataIndex: 'createdDate',
    key: 'createdDate',
    width: '12%',
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
    width: '9%'
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
    width: '8%',
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

        const message = type === 'feedback'
          ? `Новый отзыв от *${newItem.userName ? newItem.userName : 'Нет имени'}*`
          : 'Новый вопрос';

        const productValuation = type === "feedback"
          ? `Оценка *${getScoreWithSymbol(newItem.productValuation)}*\n`
          : '';

        sendMessageToAllUsers(
          `*${transformedCompanySelected.value.name}*\n` +
          `${message}\n` +
          `SKU *${newItem.comment.supplierArticle}*\n` +
          productValuation +
          `Дата *${dayjs(newItem.createdDate).format('DD.MM.YYYY HH:mm')}*`,
          newItem.id
        );
      }
    }
  };

  processNewData(newFeedbacks, 'feedback');
  processNewData(newQuestions, 'question');

  feedbacksAndQuestions.value = updateData.value;
});

// Загрузка отзывов
function feedbacksGet() {
  loading.value = true;
  message.loading('Загрузка отзывов', 0.5);

  // axios
  //   .get("https://feedbacks-api.wildberries.ru/api/v1/feedbacks", {
  //     params: {
  //       isAnswered: false,
  //       take: 5000,
  //       skip: 0,
  //       order: "dateAsc",
  //     },
  //     headers: {
  //       "Authorization": `${transformedCompanySelected.value.apiToken}`
  //     }
  //   })
  //   .then(response => {
  //     feedbacksList.value = response.data.data.feedbacks.map((feedback) => ({
  //       id: feedback.id,
  //       createdDate: feedback.createdDate,
  //       userName: feedback.userName,
  //       comment: {
  //         supplierArticle: feedback.productDetails.supplierArticle,
  //         pros: feedback.pros,
  //         cons: feedback.cons,
  //         text: feedback.text,
  //       },
  //       productName: feedback.productDetails.productName,
  //       productValuation: feedback.productValuation,
  //       photoLinks: feedback.photoLinks,
  //       type: "feedback"
  //     }));
  //
  //     loading.value = false;
  //   })
  //   .catch(error => {
  //     console.log(error);
  //     message.error('Ошибка при загрузке отзывов!');
  //     loading.value = false;
  //   });
  remainingTime.value = intervalTime; // Сбрасываем обратный отсчёт
}
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

      <div style="display: flex; align-items: center;">
        <ClockCircleOutlined style="margin-right: 5px"/> <span>обновление данных через {{ formattedTime }}</span>
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
          <span v-if="record.createdDate">
            {{ dayjs(record.createdDate).format('DD.MM.YYYY HH:mm') }}
          </span>
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
