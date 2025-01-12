<script setup>
import {
  Tag as ATag,
} from "ant-design-vue";

const props = defineProps({
  valution: {
    type: Number,
    default: null,
  }
});

const valuationMap = {
  5: { color: "green", message: "Отлично" },
  4: { color: "gold", message: "Хорошо" },
  3: { color: "red", message: "Удовлет." },
  2: { color: "red", message: "Плохо" },
  1: { color: "red", message: "Ужасно" },
};

function getColorProductValuation(value) {
  if (value === null) {
    return { color: "default", message: "Отсутствует" };
  }
  const valuation = valuationMap[value];
  return valuation
    ? { ...valuation, message: `${valuation.message} (${value})` }
    : { color: "default", message: "Некорректно" };
}

const valuation = getColorProductValuation(props.valution);

</script>

<template>
  <a-tag :color="valuation.color">
    <span>
      {{ valuation.message }}
    </span>
  </a-tag>
</template>
